<?php
/**
 * Plugin Name: AnalyzesMonitor
 * Plugin URI: http://www.analyzesmonitor.com/plugin
 * Description: Monitor analyzes on daily basis
 * Version: 1.0
 * Author: Your Company
 * Author URI: http://yourURL.com
 * Requires at least: 4.7.2
 * Tested up to: 4.7.2
 *
 * Text Domain: analyzesmonitor
 * Domain Path: /i18n/languages/
 *
 * @package AnalyzesMonitor
 * @category Core
 * @author YourCompany
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


final class AnalyzesMonitor{

	protected static $_instance = null;

	public static function get_instance(){
		if( !isset( self::$_instance ) ){
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	private function __construct(){
		$this->define_constants();
		$this->includes();
		$this->activation_hooks();

		do_action('ap_am_loaded');
	}


	private function define_constants(){
		defined ( 'AP_AM_PLUGIN_FILE' ) or define( 'AP_AM_PLUGIN_FILE', __FILE__ );
		defined ( 'AP_AM_PLUGIN_DIR' ) or define( 'AP_AM_PLUGIN_DIR', plugin_dir_path(__FILE__) );
		defined ( 'AP_AM_PLUGIN_URL' ) or define( 'AP_AM_PLUGIN_URL', plugins_url('analyzes-monitor') );
		defined ( 'AP_AM_PLUGIN_VERSION' ) or define( 'AP_AM_PLUGIN_VERSION', "1.0" );
	}


	private function includes(){
		include   AP_AM_PLUGIN_DIR.'includes/functions.php';	// basic functions
		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-config.php';	// store the pages for plugin
		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-taxonomies.php'; // register taxonomies
		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-post-types.php'; // register post types
		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-authenticate.php';	// handle authentification

		if(!is_admin() ){
			include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-frontend-scripts.php'; // load css and scripts for frontend
			include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-templates-handler.php'; // manage redirects for using plugin templates
		}
		
		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-install.php';

		include   AP_AM_PLUGIN_DIR.'includes/class-analyzes-monitor-ajax.php'; // manage AJAX requests
	}


	private function activation_hooks(){
		register_activation_hook( __FILE__, array( 'Analyzes_Monitor_Install', 'activation' ) );
		register_deactivation_hook( __FILE__, array( 'Analyzes_Monitor_Install', 'deactivation' ) );

		add_action('init', array($this, 'instalation') );
	}


	public function instalation(){
		if( is_admin() && get_option('analyzes-monitor-activated') == 1){
			Analyzes_Monitor_Install::perform_instalation();
		}
	}
}

function AM(){
	return AnalyzesMonitor::get_instance();
}

$am = AM();