<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Manage scripts loading for frontend
 * 
 * @author alex
 *
 */
class Analyzes_Monitor_Frontend_Scripts{
	
	
	public static function init(){
		add_action('wp_print_styles', array(__CLASS__, 'load_scripts'));
	}
	
	
	public static function load_scripts() {
		if (self::is_plugin_page_template ()) {
			
			wp_dequeue_script ( 'twentyseventeen-style' );
			wp_deregister_style ( 'twentyseventeen-style' );
			
			wp_enqueue_style ( 'analyze-monitor-style', AP_AM_PLUGIN_URL . '/css/analyze-monitor-style.css' );
			wp_enqueue_style ( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' );
			wp_enqueue_style ( 'dashicons' );
			
			wp_enqueue_style ( 'flatpickr-css', AP_AM_PLUGIN_URL . '/css/flatpickr.min.css' );
			// wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
			// wp_enqueue_style('font-roboto', '//fonts.googleapis.com/css?family=Roboto:400,700,900|Roboto+Slab:700&subset=latin,latin-ext');
			// <link href='https://fonts.googleapis.com/css?family=Roboto:400,700,900|Roboto+Slab:700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
			wp_enqueue_script ( 'vuejs', AP_AM_PLUGIN_URL . '/js/vue.min.js', null, true );
			wp_enqueue_script ( 'moment', AP_AM_PLUGIN_URL . '/js/moment.min.js', null, true );
			//wp_enqueue_script ( 'vuex', AP_AM_PLUGIN_URL . '/js/vuex.js', array('vuejs'), true );
			wp_enqueue_script ( 'analyze', AP_AM_PLUGIN_URL . '/js/analyze.js', array ('vuejs', 'moment'), false, true );
			
			wp_enqueue_script ( 'chart','https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js', array ( 'moment'), false, true );
			
			
			wp_enqueue_script ('flatpickr', AP_AM_PLUGIN_URL . '/js/flatpickr.js', array('jquery'), null, false);
			
			//wp_enqueue_script ('flatpickr', 'https://npmcdn.com/flatpickr/dist/flatpickr.min.js', array(), null);
			wp_enqueue_script ('flatpickr-localization', 'https://npmcdn.com/flatpickr/dist/l10n/ro.js', array('flatpickr'), null);
			
			wp_localize_script ( 'analyze', 'ajax_obj', array (
					'ajax_url' => admin_url ( 'admin-ajax.php' ),
					'plugin_url' => AP_AM_PLUGIN_URL 
			) );
			// wp_enqueue_script('jqueryvalidation', 'http://cdn.jsdelivr.net/jquery.validation/1.14.0/jquery.validate.min.js', array('jquery'), false, true);
			// wp_enqueue_script('formvalidation', AP_AM_PLUGIN_URL.'/js/form-validator.js', array('jquery', 'jqueryvalidation'), false, true);
		}
	}	

	
	public static function is_plugin_page_template(){		
		$templates_arr = Analyzes_Monitor_Config::get_plugin_pages_templates_arr();		
		return is_page_template($templates_arr);
	}
}

Analyzes_Monitor_Frontend_Scripts::init();