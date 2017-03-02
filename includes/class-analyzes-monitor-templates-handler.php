<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Manage to use templates from plugin directory
 * 
 * @author alex
 *
 */
class Analyzes_Monitor_Templates_Handler{
	
	public static function init(){
		add_filter( 'page_template',	array(__CLASS__, 'get_template_from_plugin') ); // use templates for pages from plugin dir
	}
	
	
	

	/**
	 * Use a page template from the plugin directory for plugin files
	 *
	 * @param unknown $template
	 * @return string
	 */
	public static function get_template_from_plugin( $template ) {
		
		if( is_page_template( Analyzes_Monitor_Config::get_plugin_pages_templates_arr() ) ){
	
			$page_template = get_page_template_slug(get_the_ID()) ;
			
			// if it is logout request, clear the session and redirect to login
			if( 'sincron-logout.php' == $page_template ){
				wp_logout();
				wp_redirect( ap_sc_get_url_for_page_slug('signup'));
				exit;
			}
	
			if( file_exists(AP_AM_PLUGIN_DIR . 'templates/'.$page_template) ){
				$template = AP_AM_PLUGIN_DIR . 'templates/'.$page_template;
				return $template;
			}
		}
	
		return $template;
	}
	

}


Analyzes_Monitor_Templates_Handler::init();