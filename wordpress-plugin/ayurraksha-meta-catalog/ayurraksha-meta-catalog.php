<?php
/**
 * Plugin Name: AyurRaksha Meta Ecommerce Product Catalogue Feed
 * Plugin URI: https://ayurrakshaonline.com/
 * Description: Generates a high-performance, dynamic Meta Commerce Manager / Facebook Product Catalogue XML feed via WordPress REST API (/wp-json/meta/v1/catalog). Synchronizes WooCommerce products with headless Next.js storefront URLs.
 * Version: 2.0.0
 * Author: AyurRaksha Engineering
 * Author URI: https://ayurrakshaonline.com/
 * License: GPLv2 or later
 * Text Domain: ayurraksha-meta-catalog
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

class AyurRaksha_Meta_Catalog_Feed {

    const REST_NAMESPACE = 'meta/v1';
    const REST_ROUTE     = '/catalog';
    const DEFAULT_FRONTEND_DOMAIN = 'https://ayurrakshaonline.com';

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST API endpoint
     */
    public function register_routes() {
        register_rest_route(self::REST_NAMESPACE, self::REST_ROUTE, [
            'methods'             => 'GET',
            'callback'            => [$this, 'generate_feed'],
            'permission_callback' => '__return_true', // Publicly accessible to Meta crawlers
        ]);
    }

    /**
     * Generate Meta / Google Merchant Center standard XML feed
     */
    public function generate_feed(WP_REST_Request $request) {
        if (!function_exists('wc_get_products')) {
            return new WP_Error('woocommerce_missing', 'WooCommerce is not active', ['status' => 500]);
        }

        // Allow overriding frontend URL via filter or wp-config
        $frontend_url = defined('AYURRAKSHA_FRONTEND_URL')
            ? untrailingslashit(AYURRAKSHA_FRONTEND_URL)
            : self::DEFAULT_FRONTEND_DOMAIN;

        // Query all publish, purchasable, visible products
        $query_args = [
            'status'     => 'publish',
            'visibility' => 'catalog',
            'limit'      => -1,
            'orderby'    => 'ID',
            'order'      => 'ASC',
        ];

        $products = wc_get_products($query_args);

        // Build XML
        ob_start();
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AyurRaksha Meta Ecommerce Product Catalogue</title>
    <link><?php echo esc_url($frontend_url); ?></link>
    <description>Authentic doctor-formulated classical Ayurvedic wellness supplements, oils, and tonics by AyurRaksha.</description>
    <lastBuildDate><?php echo esc_html(gmdate('D, d M Y H:i:s T')); ?></lastBuildDate>
<?php
        foreach ($products as $product) {
            $id          = $product->get_id();
            $title       = $product->get_name();
            $slug        = $product->get_slug();
            $link        = $frontend_url . '/product/' . $slug . '/';
            $image_id    = $product->get_image_id();
            $image_url   = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
            $gallery_ids = $product->get_gallery_image_ids();

            $regular_price = $product->get_regular_price();
            $sale_price    = $product->get_sale_price();
            $active_price  = $product->get_price();

            $price_val = !empty($regular_price) ? floatval($regular_price) : floatval($active_price);
            $sale_val  = !empty($sale_price) ? floatval($sale_price) : null;

            $stock_status = $product->is_in_stock() ? 'in stock' : 'out of stock';

            // Clean description
            $raw_desc = $product->get_short_description();
            if (empty($raw_desc)) {
                $raw_desc = $product->get_description();
            }
            $clean_desc = wp_strip_all_tags($raw_desc);
            if (empty($clean_desc)) {
                $clean_desc = $title . ' - Authentic Ayurvedic formulation by AyurRaksha.';
            }

            // Categories
            $term_names = wp_get_post_terms($id, 'product_cat', ['fields' => 'names']);
            $category_name = !empty($term_names) && !is_wp_error($term_names) ? $term_names[0] : 'Ayurvedic Formulations';
?>
    <item>
      <g:id><?php echo esc_html($id); ?></g:id>
      <g:title><![CDATA[<?php echo esc_html($title); ?>]]></g:title>
      <g:description><![CDATA[<?php echo esc_html(mb_substr($clean_desc, 0, 5000)); ?>]]></g:description>
      <g:link><?php echo esc_url($link); ?></g:link>
      <g:image_link><?php echo esc_url($image_url); ?></g:image_link>
<?php
            if (!empty($gallery_ids)) {
                $count = 0;
                foreach ($gallery_ids as $g_id) {
                    if ($count >= 5) break;
                    $g_url = wp_get_attachment_image_url($g_id, 'full');
                    if ($g_url) {
                        echo '      <g:additional_image_link>' . esc_url($g_url) . '</g:additional_image_link>' . "\n";
                        $count++;
                    }
                }
            }
?>
      <g:availability><?php echo esc_html($stock_status); ?></g:availability>
      <g:price><?php echo esc_html(number_format($price_val, 2, '.', '')); ?> INR</g:price>
<?php if (!empty($sale_val) && $sale_val < $price_val): ?>
      <g:sale_price><?php echo esc_html(number_format($sale_val, 2, '.', '')); ?> INR</g:sale_price>
<?php endif; ?>
      <g:condition>new</g:condition>
      <g:brand>AyurRaksha</g:brand>
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; Alternative Medicine</g:google_product_category>
      <g:product_type><?php echo esc_html($category_name); ?></g:product_type>
    </item>
<?php
        }
?>
  </channel>
</rss>
<?php
        $xml_content = ob_get_clean();

        // Serve raw XML with proper headers and caching
        $response = new WP_REST_Response();
        $response->set_headers([
            'Content-Type'  => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            'X-Robots-Tag'  => 'noindex',
        ]);
        $response->set_data($xml_content);

        // Print directly to avoid JSON encoding of XML string
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
        header('X-Robots-Tag: noindex');
        echo $xml_content;
        exit;
    }
}

// Initialize plugin
new AyurRaksha_Meta_Catalog_Feed();
