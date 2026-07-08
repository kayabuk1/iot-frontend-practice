<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cofe Tech</title>
    <!-- <link rel="stylesheet" href="css/style.css"> -->
     <style>
        @charset "UTF-8";
        :root{--header-height: 70px;}
        *{outline: 1px solid red;
             /* background-clip: content-box; 
        background-color: rgba(0,128,255,0.1); */
        margin:0; padding:0; list-style: none; box-sizing: border-box;}
        html{font-size: 100%; scroll-behavior: smooth;
             scroll-padding-top: var(--header-hight,70px);}
        body{font-size: 0.9rem; color:#333333; background-color:#f9f9f9;
        accent-color: #c0392b; font-family:Arial, Helvetica, sans-serif;}
        a{color: #333333; text-decoration: none;}
        a:hover{opacity: 0.8;}
        a:active{opacity: 0.5;}
        img{max-width:100%;}
        .wrapper{max-width: 960px; margin:0 auto; text-align: center; padding:0 5px;}

        header{position:fixed; top: 0; left: 0; z-index: 2; box-sizing: border-box;
        height: var(--header-height,70px); width: 100%;
        background-color: #f9f9f9cc;}
        header .wrapper{display:flex; justify-content: space-between;
        align-items: center; height: 100%; width: 100%;}
        .site-title a{padding: 0.1em 0.2em 0.1em 0.4em; color: #c0392b;}
        header nav{flex-grow: 0;}
        header nav ul{display: flex; column-gap: 20px; padding-right: 10px;}

        #mainvisual{position: relative; height:600px;
        margin:var(--header-height) 0 50px; overflow: hidden;}
        /*↑margin:の3つのプロパティがそれぞれどの方向の余白を意味するのか分かっていない  */
        #mainvisual img{width: 100%; height: 100%; object-fit: cover;}
        /* ↑なぜこの設定で画像が横いっぱいに広げられるのか分かっていない */
        #mainvisual li{position: absolute; top: 0; left: 0;
        width:100%; height: 100%;}
        #mainvisual div{display: flex; color:#f9f9f9;}
        #mainvisual .img-center-txt{position:absolute; top:50%; left:50%;
        z-index: 1; transform: translate(-50%, -50%); background-color: transparent;
        justify-content: center; align-items: center; flex-direction: column;}
        #mainvisual h2{font-size: 2rem; padding-bottom: 0.2em;
        width:100%; text-align-last: justify;}

        section{margin-bottom: 100px;}
        .section-title{font-size:2em; text-decoration-line: underline;
        text-decoration-color: #c0392b; text-underline-offset: 0.15em;
        text-decoration-thickness: 3px;}

        #ourmenu h2{padding-bottom: 0.8em;}
        #ourmenu dl{display:grid; grid-template-columns: 1fr 1fr; grid-column-gap: 3%;
        text-align:left;}
        #ourmenu div.grid-container{border-radius: 5px; border:1px solid #f9f9f9; 
        overflow:hidden; background-color: rgb(255, 255, 255);}
        #ourmenu img{width:100%; aspect-ratio:10/3; object-fit:cover;
        object-position:0% 30%;}
        #ourmenu dt{font-weight: bold; padding:1em;}
        #ourmenu dd{padding:1em;}
        #ourmenu p{color:#c0392b; font-weight:bold; padding:1em;}
        
        #contact {width:40%; margin: 0 auto 5%; }
        #contact h2{padding-bottom:0.8em;}
        #contact p{padding: 1em 1em 0.1em;}
        #contact form{display:flex; flex-direction: column; 
        text-align: left; border:1px solid #f9f9f9;
        border-radius:5px; overflow:hidden; width:100%;
            background-color:rgb(255, 255, 255);}
        #contact label{font-weight: bold;}
        #contact input{border-radius:5px; width: 100%; overflow:hidden;
        padding:1em; border: 1px solid #cccccc;}
        #contact textarea{width:100%; height:6em; padding:1em; border: 1px solid #cccccc;
        border-radius:5px;  overflow:hidden;} 
        #contact .button-container{display:flex; justify-content: center;
        border-radius: 5px; overflow:hidden;
         width:100%; padding:0; margin:0;
         background-color: #c0392b;}
        #contact button{color:#f9f9f9; background-color: #c0392b; 
        text-align: center; border: none; cursor:pointer;
        width:100%; padding:1em; }

        footer{background-color:#333333; color:#f9f9f9;
        margin:0;}
        footer p{padding:1em; margin:0 auto; width:max-content;}

     </style>
</head>
<body id="top">
    <header>
        <div class="wrapper">
            <h1 class="site-title"><a href="#top">Cafe Tech</a></h1>
            <nav>
                <ul>
                    <li><a href="#top">Home</a></li>
                    <li><a href="#ourmenu">Menu</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <main>
        <section id="mainvisual">
                <ul>
                    <li>
                        <img src="../puzzle/images/dog.jpg" alt="" width="300">
                        <div class="img-center-txt">
                            <h2>Cafe Tech</h2>
                            <p>至福の一杯を、あなたに。</p>
                        </div>
                    </li>
                </ul>
        </section>
        <section id="ourmenu">
            <div class="wrapper">
                <h2 class="section-title">Our Menu</h2>
                <dl>
                    <div class="grid-container">
                        <div class="grid-img-content">
                            <img src="../puzzle/images/dog.jpg" alt="">
                        </div>
                        <dt>こだわりのコーヒー</dt>
                        <dd>厳選されたアラビカ豆を100%使用し、店舗で丁寧に自家焙煎した香りとコク深い一杯です。</dd>
                        <p>￥500円</p>
                    </div>
                    <div class="grid-container">
                        <div class="grid-img-content">
                            <img src="../puzzle/images/dog.jpg" alt="">
                        </div>
                        <dt>本日のケーキ</dt>
                        <dd>季節のフルーツをふんだんに使用した、甘さ控え目でコーヒーにぴったり合う手作りケーキです。</dd>
                        <p>￥600円</p>
                    </div>
                </dl>
            </div>
        </section>
        <section id="contact">
            <div class="wrapper">
                <div>
                    <h2 class="section-title">Contact Us</h2>
                    <p>ご質問、ご要望などございましたら、下記のフォームよりお気軽にお問合せください。
                    </p>
                    <form action="htttp://192.168.11.6/~iot00/form.php" method="POST">
                            <p>
                                <label for="name">お名前</label>
                            </p>
                            <p>
                                <input type="text" name="name" id="name"
                                required placeholder="山田太郎">
                            </p>
                            <p>
                                <label for="email">メールアドレス</label>
                            </p>
                            <p>
                                <input type="email" name="email" id="email"
                                required placeholder="example@cafe-tech.com">
                            </p>
                            <p>
                                <label for="detail">お問い合わせ内容</label>
                            </p>
                            <p>
                                <textarea name="detail" id="detail" required placeholder="お問い合わせ内容をご記入ください"></textarea>
                            </p>
                            <div class="button-container">
                                <button>送信する</button>
                            </div>
                    </form>
                </div>
            </div>
        </section>
    </main>
    <footer>
        <p><small>&copy;2026 Cafe Tech All rights reserve</small></p>
    </footer>
</body>
</html>
