<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class Analyzes_Monitor_Authenticate{

	public function __construct(){
		add_action('template_redirect', array($this, 'redirect_nonauthenticated_users') );

		add_action('template_redirect', array($this, 'authenticate_users') );

		add_action('after_setup_theme', array($this, 'remove_admin_bar') );
	}


	public function redirect_nonauthenticated_users() {
		if( is_page( 'analyzes-dashboard' ) && ! is_user_logged_in() ){
			wp_redirect( home_url('/signup/') );
			exit;
		}
	}


	public function authenticate_users() {
		if( isset( $_POST['signup'] ) && wp_verify_nonce( $_POST['signup_nonce'] , 'monitor_analyze_nonce')){

			$auth = wp_authenticate($_POST['user'], $_POST['pass-field'] );
				

			if( ! is_wp_error($auth) ){
				$creds = array();
				$creds['user_login'] = $_POST['user'];
				$creds['user_password'] = $_POST['pass-field'];
				$creds['remember'] = true;
				wp_signon($creds, false);
				$dashboard_url = ap_am_get_url_for_page_slug('analyzes-dashboard');
				wp_redirect( $dashboard_url );
				exit;
			}else{
				$signup_url = ap_am_get_url_for_page_slug('signup');
				wp_redirect( $signup_url.'?loginstat=error' );
				exit;
			}
		}

		if( isset( $_REQUEST['signup']) ){
			$home_url = ap_am_get_url_for_page_slug('signup');
			wp_logout_url( $home_url );
		}
	}





	public function remove_admin_bar() {
		if (! current_user_can('administrator') && !is_admin() ) {
			show_admin_bar(false);
		}
	}


}

$auth = new Analyzes_Monitor_Authenticate();