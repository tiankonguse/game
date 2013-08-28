<?php
session_start();
require("./inc/common.php");
?>
<!DOCTYPE HTML>
<html lang="zh-cn">
<head>
<?php
//manifest="appcache.manifest"
$title = "tiankonguse's game";
require BASE_INC . 'head.inc.php';
?>
<link href="<?php echo MAIN_DOMAIN;?>css/sokoban.css" rel="stylesheet">
</head>
<body>
    <header>
        <div class="title">
            <a href="<?php echo MAIN_DOMAIN;?>"><?php echo $title; ?> </a>
        </div>
    </header>
    <section>
        <div class="container">
            <div id="game-board" class="clearfix"></div>
        </div>
    </section>
    <footer>
    <?php  require BASE_INC . 'footer.inc.php'; ?>
    </footer>
    <script src="<?php echo DOMAIN_JS;?>jquery.js"></script>
    <script src="<?php echo MAIN_DOMAIN;?>js/sokoban.js"></script>
</body>
</html>
