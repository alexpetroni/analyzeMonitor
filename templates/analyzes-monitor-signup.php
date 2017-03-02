<?php
/**
 * The template for displaying signup form
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen
 * @since 1.0
 * @version 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">

	<div class="site-content-contain">
		<div id="content" class="site-content">
<div class="wrap">
	<div id="primary" class="content-area">
	
		<main id="main" class="site-main" role="main">
		<div class="container">
		<div class="row">
			<div class="col-sm-12 text-center">
<br /><br /><br /><br />
		<h4>Autentificare</h4>

	<form name="monitor_analyze-login" id="monitor_analyze-login" method="post">
	<div class="container">
	<div class="row">
		<div class="col-sm-2 col-sm-offset-5">
		
			<div class="form-group">
				<input type="text" name="user" id="user-field" placeholder="Username" class="form-control">
			</div>
			
			<div class="form-group">
				<input type="password" name="pass-field" id="pass-field" placeholder="Password" class="form-control">		
			</div>
			<input type="hidden" value="1" name="signup" />
			
			<?php  if(isset($_GET['loginstat']) && $_GET['loginstat'] == 'error'): ?>
			<div class="row">
					<div class="small-12 columns">
						<p class="text-center error">Invalid username or password</p>
					</div>
				</div>
			<?php endif;?>
			
			<?php wp_nonce_field('monitor_analyze_nonce', 'signup_nonce'); ?> 
			<div class="row">
				<div class="col-sm-12">
					<p class="text-center">
					<input type="submit" value="Submit" name="submit" class="btn btn-primary">
					</p>
				</div>
			</div>
		
		</div>
	</div>
	</div>
	

	</form>
	
				</div>
		</div>
		</div>

		</main><!-- #main -->
	</div><!-- #primary -->

</div><!-- .wrap -->


		</div><!-- #content -->

	</div><!-- .site-content-contain -->
</div><!-- #page -->
<?php wp_footer(); ?>
<div class="footerSpacer"></div>
