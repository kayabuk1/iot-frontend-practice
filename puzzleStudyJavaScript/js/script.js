// alert("HelloWorld!!");
// alert関数が実行されるとブラウザに警告があがる。
// 引数を入れておくと、それが表示される。
console.log("Hello World!!")
// F12デベロッパーツールを開いてcosoleタブを開くと文字が表示される。
// ↑の関数は良くデバッグに使うとのこと。
// console画面の右端に script.js:4 とあるが、どのプログラムで実行されたかが
// 表示されている。:4は4行目ということ。 
// const setupArea = document.querySelector('#setup-area');
// console.log(setupArea);

// --------------------------------------------
// ◆ステップ1：DOM要素の取得とイベントの設定
// --------------------------------------------
// JSで変数を宣言するときは可能な限り const で宣言した方が良いとのこと。
// constで宣言してもオブジェクトのプロパティは変更できるとのこと。
const setupArea = document.querySelector('#setup-area');
const imageSelect = document.querySelector('#image-select');
const imageFile = document.querySelector('#image-file');
const imageFileLbl = document.querySelector('#image-file-lbl');
const gridSelect = document.querySelector('#grid-select');
const startBtn = document.querySelector('#start-btn');
const gameArea = document.querySelector('#game-area');
const moveCounter = document.querySelector('#move-counter');
const timer = document.querySelector('#timer');
const stautsLbl = document.querySelector('#status-lbl');
const puzzleBoard = document.querySelector('#puzzle-board');
const originalPreview = document.querySelector('#original-preview');
const previewBtn = document.querySelector('#preview-btn');
const backBtn = document.querySelector('#back-btn');
const clearArea = document.querySelector('#clear-area');
const finalTime = document.querySelector('#final-time');
const finalMoves = document.querySelector('#final-moves');
const restartBtn = document.querySelector('#restart-btn');

// documentはグローバル変数。
// 何も操作しなくてもブラウザがDOMの操作を出来る様に、
// ページを読み込んだ時に用意してくれるので宣言せずに使える。
// -----------------------------------------------------------
// 7/15水 ゲーム状態遷移制御の為の定数を作成
// ↓ ゲームステータスを示す定数の定義
// -----------------------------------------
const statuses = { //←変数を宣言して{}をつけることでオブジェクトになる。
    setuping: 0,    //設定中
    shuffling: 1,   //シャッフル中
    playing: 2,     //プレイ中
    cleared: 9      //クリア後
}
// ※使い方例 設定中なら、
//  gameStatus = 0;  にしておく。


// -----------------------------------------
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
let imgUrl;//中身を後で書き換えるのでletに。
let pieces; //シャッフル時のピース並び順管理用配列
let blankIndex; //空白ピース位置（盤面上空白ピース位置管理用変数）
let gameStatus = statuses.setuping; 
// ↑ 7/15水 現在のゲームの状態を管理する変数。初期値として設定中を入れておく。
let isShowingPreview = false;
// ↑ 7/15水 お手本のプレビュー表示状態を管理する変数。初期はfalse。
let moveCount;
// ↑ 7/21火 ゲーム時に動かしたピースの数を数えるカウンター変数を設置。
// ↓ 7/21火 ｽﾃｰﾀｽﾊﾞｰ経過時間表示の為のｸﾞﾛｰﾊﾞﾙ変数を追加。
let elapsedSeconds;
let timerTntervalID = null;
//👆先生の記述。インターバルIDをnullで初期化する。
// let elapsedMinutes;不要に
// let strElMi;
// let strElSec;
// let timeString; これら3つも constで関数内で宣言して使い捨てられるようにする。

// --------------------------------------------
// イベントリスナーの登録
// --------------------------------------------
// ↓各種ボタンのクリックイベント
startBtn.addEventListener('click', handleStartBtnClick);
previewBtn.addEventListener('click', handlePreviewBtnClick);
backBtn.addEventListener('click', handleBackBtnClick);
restartBtn.addEventListener('click', handleRestartBtnClick);

// 7/28火 画像ファイル選択イベントのイベントリスナーへの登録
// imageFile.addEventListener('change', handleFileSelect);

/**
 * 「ｹﾞｰﾑ開始」ボタン押下時の処理(パズル盤面の作成とシャッフルを行って、
 * ｹﾞｰﾑを開始する。)
 * @param {Event} e 
 */
// ↑関数専用のコメントの書き方。JSDocコメントと呼ぶ。
// この関数の引数はこんな形、型になっていますよと示す為のもの
// {}には{Event}が来る。※Event オブジェクト、Eventクラス。
// これを書いて置くメリット
// ⓵VScode等高機能エディタではマウスカーソルを
// 合わせるとコメントを表示してくれる。
// ⓶APIリファレンスを自動で表示してくれる？
// ﾌﾟﾛｸﾞﾗﾑ設計書を用意する手間が省けるとのこと。
async function handleStartBtnClick(e){
    // e は Event（イベント）オブジェクト。
    // そして、その中に入っている e.target が Element（HTML要素）。
    
        // ↓log主力は画像選択実装時で不要になったのでコメントアウト
    console.log(`${e.target.textContent}がクリックされた`)
    gridSize = +gridSelect.value;
    // console.log(`gridSizeの型は${typeof gridSize}です`)
    imgUrl = imageSelect.value;
    // ↑グローバル変数に画像のURLを代入。
    // HTMLSelectElement.valueとは：
    // 文字列でこのフォームコントロールの値を反映します。
    // 選択されている option 要素があれば最初のものの value プロパティを
    // 返し、そうでなければ空文字列を返します。

    // 7/15水：ゲームステータスの更新
    gameStatus = statuses.shuffling;
    console.log(`現在のgameStatusは${gameStatus}`);
    updateStatusName();

    // -7/22水追記----------------------------------------
    // resetTimer(); //117行目
    // 128行目にif (!await shufflePieces()) return;を追加したのでコメントアウト

    // -7/15水曜日追記箇所：ステップ5画面切り替え処理----------------------------------------
    switchArea(gameArea);
    // -----------------------------------------

    initPuzzle();
    // ↑パズル初期化関数の実行
    // 👇7/28 火 追加箇所。
    originalPreview.style.backgroundImage = `url(${imgUrl})`;
    // CSSの世界では、背景画像を指定するときに background-image: url("画像のパス"); というルール（文法）

    // ↓79行目 initPuzzle()の下に shufflePieces()を追加する。
    if (!await shufflePieces()) return;
    // 👆7/22水シャッフルが中断された時は下の処理が実行されないように追加。

    // 7/22水追記カウンター処理
    startTimer();

    // 7/15水：ゲームステータスをシャッフル中からプレイ中に
    gameStatus = statuses.playing;
    console.log(`現在のgameStatusは${gameStatus}`);
    updateStatusName();
}
/**
 * 「お手本を開く/閉じる」ﾎﾞﾀﾝ押下時の処理
 * （お手本の表示/非表示を切り替える）
 * @param {Event} e 
 */
function handlePreviewBtnClick(){
    // console.log(`${e.target.textContent}がクリックされた`)
    if(!isShowingPreview){
        previewBtn.textContent = 'お手本を閉じる';
        isShowingPreview = true;
        originalPreview.className = '';
        return;
    }
    // isShowingPreviewを切り替える。
    // お手本(preview)が表示状態と
        // お手本previewを表示する。
        // ボタンの名前をお手本を閉じるに変更する
    if(isShowingPreview){
        previewBtn.textContent = 'お手本を開く';
        isShowingPreview = false;
        originalPreview.className = 'hidden';
        return;
    }
    // お手本preview非表示状態に分ける
        // お手本previewを非表示にする。
        // ボタンの名前をお手本を開くに変更する。

}
/**
 * 「設定に戻る」ﾎﾞﾀﾝ押下時の処理
 * （ゲームを中止して設定画面に戻る）
 * @param {Event} e 
 */
function handleBackBtnClick(e){
    if (isShowingPreview){
        handlePreviewBtnClick();
    }
    console.log(`${e.target.textContent}がクリックされた`)

    // 7/22水 追記
    resetTimer();

    // 7/15水：ゲームステータスを設定中に戻す。
    gameStatus = statuses.setuping;
    console.log(`現在のgameStatusは${gameStatus}`);

    // 7/15水 表示エリアの切り替え
    switchArea(setupArea);
}
/**
 * 「もう一度遊ぶ」ﾎﾞﾀﾝ押下時の処理
 * （設定画面に戻る）
 * @param {Event} e 
 */
function handleRestartBtnClick(e){
    // console.log(`${e.target.textContent}がクリックされた`)
    gameStatus = statuses.setuping;
    switchArea(setupArea);
    updateStatusName();
}
/**
 * パズルの初期化処理（パズル盤面に動的にピースを追加する）
 */
function initPuzzle(){
    // ↓ 7/21火 追記箇所ｽﾃｰﾀｽﾊﾞｰ手数カウンターをパズル初期化時に同時に初期化-------
    // moveCount = 0;
    // moveCounter.textContent = moveCount;⇒関数化の為コメントアウト
    updateMoveCount();
    // ------------------------------------------------------------------

    // ↓追加するそうピース数(1辺の分割数の2乗でｓ算出)
    const totalPieces = gridSize ** 2;
    // console.log(`パズルピース総数は${totalPieces}枚です`)もういらないのでコメントアウト

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    // グローバル変数にするため変数記述箇所を移動
    // さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    // imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動

    // パズル盤面をクリアして何回押されてもピース増えない様にする
    puzzleBoard.replaceChildren();

    // ↓難易度に応じてパズルの分割数変更(CSSｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨを書き換える)
    // :root{--grid-size: 3;}選択するにはどうすれば良いか？
    // console.log(document.documentElement)//←テスト
    // script.js:122 <html lang=​"ja">​view-sourcescroll
    // <head>​…​</head>​<body>​…​</body>​flex</html>​
    // ↑documentElementでhtml全要素が取得できる！
    // ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    // ●setProperty('設定したいpropatyName', 変更したい値)を使う。
    document.documentElement.style.setProperty(
        '--grid-size', gridSize);
    
    //↓ピース並び順管理配列を空の配列として初期化
    // 下のforの中で繰り返し中で配列にピースを追加していく
    pieces = []; 
    // console.log(pieces) //で出力してみると（確認用）
    // console.log(pieces.length) //←配列の要素数を.lengthﾌﾟﾛﾊﾟﾃｨにｱｸｾｽして表示

    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')

        //148行目 ピースのｶｽﾀﾑﾃﾞｰﾀ属性に正しい位置(index)を保存
        // dataset.以降は好きな変数名を付ける(ｲﾝｽﾀﾝｽ変数を作成)
        // ピースを作成した順番は i と同じなので for中にiを代入
        piece.dataset.correctIndex = i;

        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        // ===は厳密等価演算子。型が等しいかまで判定する。両方数値OK。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        // ↓3行はピースじょうの画像生成処理
        // (CSSスタイル適用の為にclass属性とstyle属性を設定)
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        div.style.backgroundImage = `url("${imgUrl}")` ;
        // ↑ゲーム開始時に選択された画像を背景に設定

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！子要素から順に追加すると、
        // 重い画面描画処理が最小で済む。
        puzzleBoard.appendChild(piece);
        console.log(piece)

        //●173行目辺り ↓7/1 パズルピースがクリックされた時の移植した3つの関数を
        // 呼び出す処理を記述する。各piece一枚一枚はforの中で
        // 変数pieceによって管理されている。
        piece.addEventListener('click', function(){
            tryMovePiece(piece);
            // tryMovePiece()が期待する仮引数は、動かしたいﾋﾟｰｽの
            // そのものの番号stringだがJSは動的型付け言語なので、
            // 引数の型はチェックしない。
            // 探される側： pieces 配列（画面にある9個の li 要素のポインタの集まり）
            // 探すもの： wantMovePiece（今まさにクリックされた li 要素のポインタ）
            // DOM要素をそのまま渡してDOM要素を探す。という処理に自然に変わっている。
            // ●これで中身の内部データとしてはパズルの動きが処理できるようになった。
            // ●次に画面上のモデル上の動きに反映されるようにする。
            // ●どのように実現するか？
            // ●各ﾋﾟｰｽにはstyleプロパティがインラインでtransformが設定されている。
            // ●→クリックされたときにその分移動させる処理を作っていくとのこと。 

            //↓●ピースの画面表示位置を更新する処理関数をすぐに呼び出す
            // console.log(getMovableIndices())デバッグ用
            // console.log(piece)
            // console.log(getMovableIndices().includes(piece))
            // if(tryMovePiece(piece)===true){
            // // ↑tryMovePiece(piece)
            //     updatePiecePosition(piece,blankIndex);
            // }●↑この書き方では、後でtryMove関数を経由しない処理
            // （移動可能かどうかの判定が不要な処理）
            // ピースのシャッフルをする時に、連動させることができない
            // ので、movePieceの中にupdatePiecePosition関数を
            // 組み込んでしまうほうが良いとのこと。
        })

        // ↓ピース並び順管理配列にピースを追加※piece="li"作ったピース
        pieces.push(piece);
        
        } //←for文の終わり

        // puzzleBoard.removeChild(document.querySelector('.puzzle-piece')) replaceChildren();を使うのでコメントアウト
        console.log(pieces); //並び順管理配列追加動作確認用

        // ↓空白ピースの位置を記録。totalpiecesは0始まりなので-1しておく
        blankIndex = totalPieces - 1;
        console.log(blankIndex);

        
}
// -----------------------------------------
// 194行目辺り
// ↓7/1㈬modele.jsで作ったパズル移動関数を移植
// -----------------------------------------
/**
 * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
 * @returns {Array<number>}移動可能なピースの位置index配列
 */ 
function getMovableIndices()
{   
    let blanekNeighbors = [];

    if(blankIndex % gridSize != 0){
        blanekNeighbors.push(blankIndex-1);
        console.log([blankIndex-1]);
    }
    if(blankIndex % gridSize != (gridSize-1)){
        blanekNeighbors.push(blankIndex+1);
        console.log([blankIndex+1]);
    }
    if(0 <= (blankIndex-gridSize)){
        blanekNeighbors.push(blankIndex-gridSize);
        console.log([blankIndex-gridSize]);
    }
    if((gridSize**2 - gridSize) > blankIndex){
        blanekNeighbors.push(blankIndex+gridSize);
        console.log([blankIndex+gridSize]);
    }
    // blanekNeighbors.unshift(blankIndex);
    console.log(`移動可能なピースインデックス：${blanekNeighbors}`)
    return blanekNeighbors
}

// ↓ ●7/6追加関数。
/**
 * 移動可能なピースをランダムに選択して複数回の移動を繰り返す処理
 */
async function shufflePieces(){
    const shuffleSteps = 1;//gridSize**2*4;
    // ↑シャッフルの回数を保存しておく変数。難易度で変わる様にする。
// ----------------------------------------------------------------
// 7/14 ↓ ピースのシャッフル時の移動を非同期的に目に見えるようにする追加
// const delayTime = 100; //ミリ秒追加
// ----------------------------------------------------------------
// ------------------------------------------------------------
// ◆ 7/15水、次。難易度によってはシャフルする時間が長すぎるのを変更する。
// ⇒262行付近delayTimeを固定値ではなくて、計算で求めるようにする。
// ----------------------------------------------------------------------- 
// 3*3の時のシャッフル回数＝36回＝3600ミリ秒、なので、
const delayTime = 3000/shuffleSteps;
// ⇒上級を選ぶと同時に何ピースも動いてしまっている。
// ⇒実際にピースが動くに掛かる時間と、待機時間がずれてしまっているため。
// ⇒実際にピースが動く時間はcssのカスタムプロパティで100msで管理している。
// ⇒◆CSSのカスタムプロパティの値をJSから変更してやる必要がある。
    //※documentElementでhtml全要素が取得できる
    //※ ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    //● ⇒普通のプロパティはどのように選択、追加していたっけ？
// 130行目あたりの initPuzzle()内の
// document.documentElement.style.setProperty('--grid-size', gridsize)
document.documentElement.style.setProperty(
    '--piece-move-duration', `${delayTime}ms`)
// ↑ これで難易度を変えてもシャフル時間が等しくなった。
// ◆しかし、これによって高難易度では、ゲーム時のクリックの動きまで早くなってしまった。
// シャフル処理終了後に ↓ の様に戻してやれば達成できるが、
// もし後でカスタムプロパティを変更したい場合に2か所変更しないといけない。
// それは、ハードコーディングと言い、保守性が低下して良くないとのこと。
// document.documentElement.style.setProperty(
    // '--piece-move-duration', `100ms`)
// ★この時のHTMLの記述に注目　F12でみると、　
// <!DOCTYPE html>
// html lang syle"""~とhtml要素のインライン要素として上書きされている。
// ⇒★なので設定したHTMLのstyle属性を削除してやれば、CSSの設定に戻る！
// shufflePuzzle()のfor文を抜けた最後の1行に
// document.documentElement.style.removeProperty('--piece-move-duration');
// とプロパティを削除する記述を書いてOK！



    // ↑そして、386行付近、movePiece(targetIndex)が実行された直後に、
    // delayTimeミリ秒が経過したら、結果が返される Promise を作成し、
    // その完了を awaitで待機する処理を追加する。



    // ↓このfor文上限に↑の数をセットして中でランダムにピースの移動を繰り返す。
    // for (let i=0; i<shuffleSteps; i++){
        // ★中に書き込む必要な処理を細かく分けて書き込んでみる。

        // １．移動可能なピースを取得する⇒getMovableIndicies()を使用する。
        // let movableIndices = getMovableIndices();
        // console.log(movableIndices);
        // ２．乱数を生成して移動可能なピースのｲﾝﾃﾞｯｸｽのいずれかを選択する。

        // ↓これでは無駄が多いので改良
        // console.log(pieces.length);
        // let randomChiceIndex = Math.floor(Math.random()*(pieces.length-1));
        // console.log(randomChiceIndex);
        // if(movableIndices.includes(randomChiceIndex)){
        //     movePiece(randomChiceIndex,movableIndices);
        // }else{
        //     i--;
        // }
        // ３．選択されたピースを移動する⇒movePiece()を使う。
        // movePiece();

        // let randomResult = Math.random();
        // let randomDelimiter = 1/movableIndices.length
        // // ex:0.3なら、/2したら0.15
        // // randomResult < randomDelimiter
        // // randomDelimiter <= randomResult < randomDelimiter *2
        // // randomDelimiter*2 <= randomResult < randomDelimiter *3
        // // randomDelimiter*3 <= randomResult <randomDelimiter *4
        // if(movableIndices.length>=4){
        //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
        //     else if(randomDelimiter <= randomResult < randomDelimiter *2){movePiece(movableIndices[movableIndices.length-2],movableIndices);}
        //     else if(randomDelimiter*2 <= randomResult < randomDelimiter *3){movePiece(movableIndices[movableIndices.length-3],movableIndices);}
        //     else{movePiece(movableIndices[movableIndices.length-4],movableIndices);}
        // }
        // else if(movableIndices.length>=3){
        //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
        //     else if(randomDelimiter <= randomResult < randomDelimiter *2){movePiece(movableIndices[movableIndices.length-2],movableIndices);}
        //     else{movePiece(movableIndices[movableIndices.length-3],movableIndices);}
        // }
        // else {
        //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
        //     else{movePiece(movableIndices[movableIndices.length-2],movableIndices);}
        // }
        // if文の地獄だがこれでもなんとか動いた、、、。がパズルの0行目が全く動かなかった。

        // ◆7/9↓ここから-----------------------------------------
    let lastMovedIndex;
        // ↑前回移動したピースを記憶するための変数を作成。
    let randomPointer;
    for (let i=0; i<shuffleSteps; i++)
    {   
        // -----7/21火曜日ここから↓設定に戻るで二重シャッフルされている処理を中断させる------------------
        if(gameStatus!==statuses.shuffling) return false; //👈false7/22水追加。

        console.log('------------------シャッフル処理区切り-------------------');
        let currentpiecesarray = {};
        for(let j=0; j < gridSize**2; j++){
            let ci = pieces[j].dataset.correctIndex;
            let str = ci.replace(/[0-9]/g, function(char){
                return String.fromCharCode(char.charCodeAt(0)+0xFEE0);
            });
            currentpiecesarray[j] = str;
        }
        console.log(
            `現在のピース配列
            ※ﾋﾟｰｽｲﾝﾃﾞｯｸｽ：ピース番号：${JSON.stringify(currentpiecesarray)}`);
        console.log(`現在の空白ピースインデックス：${blankIndex}`);
        // ↓★正解の一番すっきりしたコード
        // １．移動可能なピースのインデックス配列（候補リスト）を取得する
        let movableIndices = getMovableIndices();
        console.log(`lastMovedIndex；${lastMovedIndex}`);
        console.log(
            `movableIndices.indexOf(lastMovedIndex)：${movableIndices.indexOf(lastMovedIndex)}`);
        // ●↑前回移動したピースインデックスをmovableIndicesから削除する。
        console.log(movableIndices.includes(lastMovedIndex));
        // if (movableIndices.includes(lastMovedIndex)){
        //         movableIndices.splice(
        //             movableIndices.indexOf(lastMovedIndex), 1);
        // }
        const trueMovableIndices = movableIndices.filter(
            (movableIndex)=>movableIndex!=lastMovedIndex);
        console.log(
            `filterを使った結果※trueMovableIndices:${trueMovableIndices}`);
        //-------------------------------------------------------
        //const result = words.filter((word) => word.length > 6);
        // 7/14火 filterメソッドを使って↑の処理を書き換える。
        //-------------------------------------------------------
        /* filterメソッドの中身
        const array = [];
        for(i=0; i<movables.length; i++){
            const movable = movables[i];
            movables（移動可能なピース配列から1つ取り出して処理を繰り返す。）
            if(func_x(movables)){
                ↑のfunc_x = filterﾒｿｯﾄﾞに渡す関数の実行結果がboolean型で戻ってくる
                array.push(movable);
                ↑結果がTrueの場合のみ新たな配列arrayに値を追加する。
            }
        }
        retrun array;
        ↓ filetrメソッドに渡す関数
        func_X(movable){
            return ここがboolean型になる。
        }
        */
        console.log(`残ったピースインデックス：${trueMovableIndices}`);
        // ２．候補リストの「長さ」を掛けて切り捨てることで、
        // 0 〜 (length-1) の安全なランダムポインタ（配列の要素番号）を生成する
        randomPointer =
         Math.floor(Math.random() * trueMovableIndices.length);
        console.log(`ランダムで選ばれたmovable中のﾋﾟｰｽｲﾝﾃﾞｸｯｽは${randomPointer}
            動かすpiecesのピースインデックスは${trueMovableIndices[randomPointer]}`
        );
        // ３．生成したポインタを使って、配列から「実際に動かすピースの番号」を抽出
        let targetIndex = trueMovableIndices[randomPointer];
        console.log(`targetIndex：${targetIndex}`)
        // ４．ピースを移動
        lastMovedIndex = blankIndex;
        movePiece(targetIndex);
        //-----------------------------------------
        // ↑この直後に非同期的処理を追加する。
        //-----------------------------------------
        // ----------------------------------------------------------------
        // 7/14 ↓ ピースのシャッフル時の移動を非同期的に目に見えるようにする追加
        // const delayTime = 100; //ミリ秒追加
        // ----------------------------------------------------------------
        // ↑そして、386行付近、movePiece(targetIndex)が実行された直後に、
        // delayTimeミリ秒が経過したら、結果が返される Promise を作成し、
        // その完了を awaitで待機する処理を追加する。
        // ----------------------
        // ↓自分で書いて見た結果。
        //------------------------
        try{
            await wait();
        }catch(error){;}
        finally{;}
        function wait(){return new Promise((resolve, reject)=>{
            setTimeout(()=>{resolve();}, delayTime);
        })}
        // -----------------------------------------
        // 7/15水ここから
        // waitなど関数を使わずに、直接Promiswを続けても良いとのこと
        // ↓ 先生の書き方。
        // -----------------------------------------
        // delayTimeﾐﾘ秒経過したら、完了するPromiseを作成し、
        // その完了を await で待機する。
        // await new Promise((resolve, reject)=>{
        //     // Promiseの中の処理には delayTimeミリ秒後に完了(成功)を通知する
        //     // 処理を記述すれば良い。
        //     setTimeout(() => {
        //         // その為にはsetimeoutを記述し、その中でresolveを書けば良い。
        //         // resolve()の引数を渡す時は、成功の通知と 一緒に 実行の結果など
        //         // を使いたい場合に渡す。ただ、今回はただ待つだけで良いので
        //         // 何も渡さなくて良い。
        //         resolve();
        //     }, delayTime);
        // })
        // // -------- ↓ 更に省略して書いたパターン---------------------------------
        // await new Promise((resolve)=>setTimeout(resolve, delayTime));
            // setTimeoutの第一引数には第二引数で指定した時間経過後に実行してほしい
            // 関数を書くが、resolveしかしないので、関数自体を渡す形にしてしまってよい。
            // 更にPromiseで完了したか判断する処理も1行にまとめて{}を省略して良い。
            // 更に reject         

        console.log(`targetIndex：ﾋﾟｰｽｲﾝﾃﾞｸｯｽ${targetIndex}は`)
        console.log(`lastMovedIndex：ﾋﾟｰｽｲﾝﾃﾞｸｯｽ${lastMovedIndex}に移動しました。`)
        console.log(`movableIndices[lastMovedIndex]：
            ${trueMovableIndices[lastMovedIndex]}`);
        // ↑移動したピースインデックスを記憶
        // このピースインデックスをmovableIndicesから除外する処理を追加すればOK
        console.log(`${i+1}回シャッフルしました。`)
        currentpiecesarray = {};
        for(let j=0; j < gridSize**2; j++){
            let ci = pieces[j].dataset.correctIndex;
            let str = ci.replace(/[0-9]/g, function(char){
                return String.fromCharCode(char.charCodeAt(0)+0xFEE0);
            });
            currentpiecesarray[j] = str;
        }
        console.log(
            `現在のピース配列※シャッフル前基準：${JSON.stringify(currentpiecesarray)}`);
        console.log(`現在の空白ピースインデックス：${blankIndex}`);
    }
    document.documentElement.style.removeProperty('--piece-move-duration');

    // ↓ 7/22水追記箇所
    return true;
}



/**
 * 引数で指定されたピースが移動可能な場合のみ移動する処理
 * @param {string} piece 移動対処ピースは文字列で渡すこと
 */
// const movalePieceStr = string(blanekNeighbors)
// function tryMovePiece(movalePieceStr){
//     for(let i=0; i < length(movalePieceStr); i++)
//     {
//     const movalePiecesClicker
//     = document.querySelector(`.data-correct-index=${movalePieceStr[i]}`);
//     }
// }
// ----------------------------------------------------
// ↓前回独力で取り組んだが作ることは出来なかった。
// 6月24日(水)はこの tryMovePiece関数の作成の続きから。
// ----------------------------------------------------
// const movalePieceStr = string(blanekNeighbors)
// li.dataCorrectIndex.addEventListener('click' ,tryMovePiece);
// function tryMovePiece(movalePieceStr){
//     if (li.dataCorrectIndex === movalePieceStr) {
//         // ↑クリックされたのが動かせる配列リストindexと一致するならと書きたいのだけれど、、、

//         // ↑クリックされたピースと空白の位置を入れ替える
//         blankIndex,movalePieceStr[動かせる配列index] = movalePieceStr[動かせる配列index],blankIndex;        
//         // ↑blankとの配列番号を入れ替える。
//     }
// }
function tryMovePiece(wantMovePiece){
    if (gameStatus !== statuses.playing || isShowingPreview) return;
    if(moveCount===0){
        console.log('-----------------------ゲーム開始---------------------------');
    }
    let currentpiecesarray = {};
    for(let j=0; j < gridSize**2; j++){
        let ci = pieces[j].dataset.correctIndex;
        let str = ci.replace(/[0-9]/g, function(char){
        return String.fromCharCode(char.charCodeAt(0)+0xFEE0);
        });
        currentpiecesarray[j] = str;
        }
        console.log(
            `現在のピース配列
            ※ﾋﾟｰｽｲﾝﾃﾞｯｸｽ：ピース番号：${JSON.stringify(currentpiecesarray)}`);    
    // ●↓この関数を作る上で役に立つarrayｵﾌﾞｼﾞｪｸﾄメソッドの紹介
    // includes()：配列の中に特定の要素が含まれているかどうかを
    //             true or false で返してくれる。
    // indexOf()：arrayの中から対象の要素の場所を教えてくれる。
    //          対象の要素が含まれていないときは -1が返ってくる。
    // ●↓どう使うか？
    // １．indexOf()を使ってユーザーが動かしたい！と選択したピースが
    //     ピースがピース管理配列上のどの位置にあるか＝インデックスを
    // 取得する。
    // ２．前回作ったgetMovablesIndices()を 使って、移動可能な
    //     ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列を取得。
    // ３．includes()を使って、移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列に、
    //     移動させたいﾋﾟｰｽｲﾝﾃﾞｯｸｽが含まれるかを確認すれば良い。
    // ４．含まれていた場合は、移動させたいピースと移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ
    //     の位置をスワップすればOK。
    console.log(`動かしたいピースは${wantMovePiece}`);
    console.log(`piecesの１次元配列表示：${pieces}`);
    let wantMovePieceIndex = pieces.indexOf(wantMovePiece);
    console.log
    (`選択されたピース(cp※chiced piece)は：${wantMovePieceIndex}`);
    let movableIndexies = getMovableIndices();
    console.log
    (`動かせるピースの位置(movableIndexies)は：${movableIndexies}`);
    if (movableIndexies.includes(wantMovePieceIndex)){
        movePiece(wantMovePieceIndex,movableIndexies)
        // --↓ 7/21火 -追加箇所------
        // moveCount++;
        // moveCounter.textContent = moveCount;⇒関数化の為コメントアウト
        updateMoveCount();
        // -------------------------

        // movePiece(cpIndex);
        // ↑ なぜ引数が足りないのに動く（エラーにならない）のか？
// 呼び出し側（引数は1つだけ）
// movePiece(cpIndex);
// 定義側（引数は2つ待っている）
// function movePiece(cpIndex, mov) { ... }
// C言語であれば、コンパイル時に「引数の数が合わない！」と即座に弾かれます。しかし、JavaScriptは実行時にクラッシュしないように作られた言語であるため、引数の数が合わなくても一切エラーになりません。
// 【裏側で起きている物理演算】 JavaScriptでは、関数を呼び出した時に「渡されなかった引数」があった場合、ブラウザが勝手に気を利かせて**「足りない仮引数には undefined（未定義）という特殊な値を代入しておく」**という処理を行います
// 。
// つまり、今回裏側では movePiece(7, undefined); という形で関数が実行されていたため、プログラムが停止することなく動いていたのです。
    } else {
        console.log("そのピースは動かせません。\
            wantMovePieceに違うピースインデックスを代入してください。");
        console.log(getMovableIndices());
    }
    // printPuzzle();
    console.log(`現在の動かせるピースは：${getMovableIndices()}`);

 currentpiecesarray = {};
        for(let j=0; j < gridSize**2; j++){
            let ci = pieces[j].dataset.correctIndex;
            let str = ci.replace(/[0-9]/g, function(char){
                return String.fromCharCode(char.charCodeAt(0)+0xFEE0);
            });
            currentpiecesarray[j] = str;
        }
        console.log(
            `現在のピース配列※シャッフル前基準：${JSON.stringify(
                currentpiecesarray)}`);
        console.log(`現在の空白ピースインデックス：${blankIndex}`); 

//ゲームクリアチェックを毎回一手動かすごとにチェックしていく。 
checkGameClear();
console.log('----------------------------１手終了-------------------------');
}



/**
 * ﾋﾟｰｽ管理配列内で引数で指定されたｲﾝﾃﾞｯｸｽ要素と
 * 空白ﾋﾟｰｽを交換する処理をする関数
 * @param {number} index 移動ピースのｲﾝﾃﾞｯｸｽを渡す
 */
function movePiece(wantMovePieceIndex){
    // 「入れ子（2重関数定義）」になっていない独立した関数同士では、
    // 必ず【実行時に実引数として渡し、仮引数で受け取る】必要がある。
    [pieces[blankIndex], pieces[wantMovePieceIndex]] =
        [pieces[wantMovePieceIndex], pieces[blankIndex]];
    let movedpieceindex = wantMovePieceIndex
    // ↑スワップ後にわかりやすい名前に変更

    let movedPiece = pieces[blankIndex];
    // updatePiecePosition()に渡すのはliというDOM要素自体にする
    updatePiecePosition(movedPiece);
    
    blankIndex = movedpieceindex;
    // ↑空白ピース位置ｲﾝﾃﾞｯｸｽ自体を更新する

    console.log(`blankIndexを更新しました：${blankIndex}`);
    // console.log(wantMovePieceIndex,movableIndexies); 
    // console.log(pieces);//←デバック用
    console.log("ピースを入れ替えました。");  
}
// ↑移植関数ここまで
// -----------------------------------------
function printPuzzle(){
    console.log(pieces);
    for (let i=0; i < gridSize**2; i+=gridSize){
        let tempArray = [];
        for(let j=0; j < gridSize; j++){
            // console.log(pieces[i+j],end="");
            tempArray.push(pieces[i+j]);
        }
        console.log(tempArray);
    }
}
// ●313行目↑7/1printPuzzleも追加。
// ◆【ステップ 4】アニメーションとスワップ処理
// 配列の要素が入れ替わっただけでは、画面上のピースは動きません。
// DOM要素の並び順を変えずに、CSSを使って滑らかなアニメーション移動を
// 実現します。
// 4.1 作業内容
// パズルの各ピースのCSS位置移動を反映させる
//  updatePiecePosition(index) 関数を作成

/**345行目付近
 * ﾋﾟｰｽ順番管理配列上で移動されたピースの表示位置を更新する
 * （ﾋﾟｰｽ順番管理配列上の位置と画面表示上の位置を合わせる）
 * ↓つまりこれを配列順序更新後に呼び出せばよい。
 */
function updatePiecePosition(movedPiece){
    console.log(movedPiece);

    // pieces[8].style.transform = 'translate(0%, 100%)';
    // %単位で移動値を指定すると、「その要素自身の大きさ」
    // に対して何%分動かすかという指示になるとのこと。
    // ↑試しに1ピースだけ固定値でクリックしたら移動して見える様に
    // 書くとこのようになるとこと。
    // ↓画像の表示はこの配列のままだが、
    //  中身のpiecesのindexはupdatePiecesPosition()が呼ばれた
    //  段階ですでに入れ替わっているので[8]は↓
    //  右図の元の5の位置のピースのstyleを操作していることになる。
    // 
    // 3_0_1_2 余列↓                      _____
    // 0|０１２                           |０１２
    // 1|３４５                           |３４[８]
    // 2|６７８                           |６７５
    // 商行→
    // ●↑を元にピースを汎用的に動かす式を書くにはどうしたら良いか？
    // ●右のピースが左のピースの位置に戻るように動かせれば達成出来る
    // ●元のピース位置:5：行5/3 = ➊...2 ※0行始まり
    //               　  列5/3 = 1...➋ ※0列始まり
    // ●動かすピース位置8：行8/3 = ➋...1
    //                  ：列8/3 = 2...➊
    //  piece.dataset.correctIndex = i;forの中でピース生成時に
    // correctIndexを追加しているので、それを利用すると良いとのこと。
    // 
    // blankIndexとcpIndexは使えそうだな。
    // 考えるときは具体例を。今回の[8]にblankIndexが移動した後は、
    // blankIndex=5, cpIndex=8
    // pieces[cpIndex].style.transform = 
    // `translate(calc(int(${cpIndex}/3) - int(${blankIndex}/3)*100)%,\
    // calc(int(${cpIndex}%3) - int(${blankIndex}%3)*100)%);`;
    // ●↑では間違い。
    // console.log(movedPiece.dataset.correctIndex);
    // console.log(`movedpiece：${movedPiece}`)
    let currentIndex = pieces.indexOf(movedPiece);
    // console.log(currentIndex);
    movedPiece.style.transform = 
    `translate(
        calc(
                (${currentIndex%gridSize} 
                - ${movedPiece.dataset.correctIndex%gridSize}
                )*100%
            ),
        calc(
                (${Math.floor(currentIndex/gridSize)} 
                - ${Math.floor(movedPiece.dataset.correctIndex/gridSize)}
                )*100%
            )
     )`;
//●次： このままではクリックされた時に必ず実行されてしまう。
// （元の位置－動かした位置が同じなので、ピースは動かないが、
// 毎回重い処理の計算を行ってtranslate0%,0%が付与されてしまう。
// それでは非効率なので、移動可能ピースがクリックされた時だけ
// uodatePiecePosition関数が実行されるようにする。

}


// ------- ↓ 7/15水追加---------------------------------------
/**
 * ◆画面に表示するエリアの切替処理をする関数
 * activeArea に指定されたエリアを画面に表示し、その他のエリアは非表示にする処理。
 * ※各sectionにclass ="hidden"属性を付与する。 
 * const setupArea = document.querySelector('#setup-area');
 * const gameArea = document.querySelector('#game-area');
 * const clearArea = document.querySelector('#clear-area');
 * ↑コード上部で先に取得していたエリア要素を利用する。
 * @param {Element} avtiveArea HTMLの要素＝画面に表示したいエリアを引数で受取る
 */
function switchArea(activeArea){
    // ●１．handleStartBtnClick()内※スタートボタンが押された時に実行される
    // 関数。これのinitPuzzle()の処理行前に、このswitcArea()が呼び出される様にする
    // setupArea.className ="space-y hidden";
    setupArea.classList.add("hidden");
    gameArea.classList.add("hidden");
    clearArea.classList.add("hidden");
    console.log(activeArea);
    activeArea.classList.remove("hidden");
}

/**
    現在のゲームステータスをもとに画面に表示するステータス名を更新する処理。
 * グローバル変数としてステータス変数は宣言しているので引数は無し。
 */
function updateStatusName(){
    // ステータスがｼｬｯﾌﾙ中の場合はｽﾃｰﾀｽﾊﾞｰに「シャッフル中...」を表示
    // ステータスがプレイ中の場合は、ｽﾃｰﾀｽﾊﾞｰに「プレイ中」を表示
    // const text = e.target.textContent;
    // const stautsLbl = document.querySelector('#status-lbl');
    if (gameStatus===statuses.shuffling){
        stautsLbl.textContent = 'シャッフル中...';
        stautsLbl.className = 'status-shuffling';
        // ↓ お手本を開くボタンを非活性化
        //   <label for="emp">雇用:</label>
        //   <select id="emp" name="emp" disabled></select>
        // ↑ の様にHTML要素に disabledが設定される。
        // disabledには論理値＝true/flase が格納される。
        previewBtn.disabled = true;
        puzzleBoard.style.pointerEvents = 'none';
    }
    else if (gameStatus===statuses.playing){
        stautsLbl.textContent = 'プレイ中';
        stautsLbl.className = 'status-playing';
        // ↓お手本ボタン再活性化
        previewBtn.disabled = false;
        puzzleBoard.style.pointerEvents = 'auto';
    }else if (gameStatus===statuses.cleared){
        puzzleBoard.style.pointerEvents = 'none';
        previewBtn.disabled = true;
        backBtn.disabled = true;
    }else if (gameStatus===statuses.setuping){
        puzzleBoard.style.pointerEvents = 'auto';
        previewBtn.disabled = false;
        backBtn.disabled = false;
    }



}
/**
 * ピースの移動させた手数を記録させる関数
 * @param {*} 
 */
function updateMoveCount(){
     if((gameStatus===statuses.setuping)||(gameStatus===statuses.shuffling))
        {
         moveCount = 0;
         moveCounter.textContent = moveCount;
         console.log(`moveCount：${moveCount}`)
         return;
     }
     else if(gameStatus===statuses.playing){
         moveCount++;
         moveCounter.textContent = moveCount;
         console.log(`moveCount：${moveCount}`)
         return;
     }
}

/**
 * 
 */
function startTimer(){
     elapsedSeconds = 57;
     renderTimer(elapsedSeconds);
     timerTntervalID = setInterval(updateTimer, 1000);
    }
function updateTimer(){
    elapsedSeconds++;
    renderTimer(elapsedSeconds);
    }
function resetTimer(){
    clearInterval(timerTntervalID);
    elapsedSeconds = 0;
    renderTimer(elapsedSeconds);
}
function stopTimer(){
    clearInterval(timerTntervalID);
    renderTimer(elapsedSeconds);
}
function renderTimer(Seconds){
    const strMi = Math.floor(Seconds/60).toString().padStart(2, '0');
    const strSec = (Seconds%60).toString().padStart(2, '0');
    const timeString = `${strMi}：${strSec}`;
    timer.textContent = timeString;
    return timeString;
}

/**
 * ｹﾞｰﾑｸﾘｱ判定とゲームクリアエリアの表示を行う関数
 * ※ピース動かした後毎度クリア判定を行う。
 */
function checkGameClear()
{
    // ◆↓ゲームクリア処理試作、配列作成バージョン-----------------------------
    // let matchCount = 0;
    // let currentIndexies = [];
    // let correctIndexies = [];
    // for (let i=0; i<pieces.length; i++){
    //     let ci = pieces[i].dataset.correctIndex;
    //     currentIndexies[i] = Number(ci).toString();
    //     correctIndexies[i] = i.toString();
    // }
    // console.log(currentIndexies);
    // console.log(correctIndexies);
    // for(let j=0; j < pieces.length; j++){
    //     if(currentIndexies[j]===correctIndexies[j]){
    //         matchCount++;
    //     }
    // }
    // if (matchCount >= pieces.length){
    //     console.log(`ゲームクリア`);
    // }
    // if (currentIndexies.toString() === correctIndexies.toString())
    // {
	// alert('ゲームクリア');
    // } else {
	// alert('ゲーム続行');
    // }
    // console.log(pieces)
    // ----------------------------------------------------------
    // ◆7/22水 次、配列を作らずにゲームクリアをする方法を考えてほしいとのこと。
    // ----------------------------------------------------------    
    // let mcount = 0;
    // for(let k=0; k < pieces.length; k++){
    //     if(k!==Number(pieces[k].dataset.correctIndex)){
    //         break;
    //     }else{
    //         mcount++;
    //         console.log(mcount);
    //         if(mcount >= pieces.length)alert(`クリア`);
    //     }
    // }
    // -----------------------------------------
    // 7/22水 先生のお手本の書き方
    // クリア判定のよく使う手法としては先にクリアフラグを立てておくとのこと。
    //-----------------------------------------
    let cleard = true;
    for (let l=0; l < pieces.length; l++){
        if(l !== +pieces[l].dataset.correctIndex){
            // 👆+を付けるだけで型変換が出来るとのこと。
            cleard = false;
            break;
        }
    }
    if(cleard){
         console.log(`ゲームクリア！！！`);
         stopTimer();
         gameStatus = statuses.cleared;
         console.log(gameStatus);
         pieces[(pieces.length - 1)].classList.remove("hidden");
         updateStatusName();
         showClearArea();
    }
    // -----------------------------------------
    // 7/22水 先生のお手本の書き方 ２
    // 更に、every()を使った、よりJavaScriptらしい書き方があるとのこと。
    //-----------------------------------------
    const game_cleard = pieces.every(
        (elem, index)=> index=== +elem.dataset.correctIndex);
    if(game_cleard) console.log(`くりあ！！！`);
}
// ---- ↓ 7/23木追加関数

async function showClearArea(){
    const clearTime = renderTimer(elapsedSeconds);
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    switchArea(clearArea);
    finalTime.textContent = clearTime;
    finalMoves.textContent = moveCount;
// ◆参考switchArea---------------------------
// function switchArea(activeArea)
//     setupArea.classList.add("hidden");
//     gameArea.classList.add("hidden");
//     clearArea.classList.add("hidden");
//     console.log(activeArea);
//     activeArea.classList.remove("hidden");
// --------------------------------------------
// ◆参考htmlゲームクリアエリア
// // <!-- 結果発表ボックス -->
//             <p class="score-box">
//                 かかった時間: <span id="final-time">00:00</span><br>
//                 かかった手数: <span id="final-moves">0</span>回
//             </p>
//             <button id="restart-btn" class="btn-primary">
//                 もう一度遊ぶ（設定に戻る）</button>
// ------------------------------------------------------
// ◆参考
// function renderTimer(Seconds){
//     const strMi = Math.floor(Seconds/60).toString().padStart(2, '0');
//     const strSec = (Seconds%60).toString().padStart(2, '0');
//     const timeString = `${strMi}：${strSec}`;
//     timer.textContent = timeString;
//     return timeString;👈retrunを追加
}


// ===========================================================================
//------関数エリアここまで---------------------------------------------------------------
// ===========================================================================
// ↑毎回無名関数を記述するのは面倒なので、関数定義して、
// 引数に関数オブジェクト自体※()は付けると実行しろの意になってしまう。
// を渡して、実行する。
// 引数の関数名が関数定義より先に来ていても参照エラーにならない。

/**/
// ↓ボタンが押されたら文字が追加される簡単な処理を書く
// ※addEventListener()内には実行仕手ほしい処理を書く
// let counter = 0;
// カウンター変数はグローバルにしないと駄目。
// もしaddEventListener内に記述した場合は、毎回呼び出された時、
// 初期化が行われてしまう。
// constで宣言すると、Uncaught TypeError: 
// Assignment to constant variable は、const で宣言した定数
// （変数）に対して、後から別の値を 再代入しようとしたこと が原因。
// startBtn.addEventListener('click', function(e){
    // ('click', (e)=>{} 又は、
    // ('click', (e)=>console.log(`${e.target.textContent}が
    // ${++counter}回クリックされた`));とすれば、
    // {}不要で1行で記述出来るとのこと。
    // ↑funciton(){}は無名関数lambdaの様なもの。
    // この場合はfunctionがイベントハンドラー？
    // (e) はEventオブジェクト、発生したイベントに付随する色々な情報が
    // eventオブジェクトの中に書き込まれる。
    // const text = e.target.textContent;
    // targetにはイベント開始ボタンが入る。
    // e.target==startBtn
    // e.targetという書き方でオブジェクトが生成される？
    // .targetはプロパティ
    // textcontentﾌﾟﾛﾊﾟﾃｨはHTMLのタグの中身が入るオブジェクト変数？
    // console.log('\n'+text);
    // console.log(text+'が'+ ++counter +'回クリックされた');
    // // インクリメントは前置にしないとcounterを参照した後にプラスされて
    // // 表示とクリック回数が一回遅れてしまう。
    // console.log(`${text}が'${++counter}回クリックされた`);
    // ↑+が連続して見ずらいので``を使った別の書き方とのこと。
    // Q.「`」これはバックスラッシュなの?「\」と同じ記号には見えないのだけれど
    // A.バッククォート（逆引用符）
    // Q.pythonのフォーマット構文と同じ？
    // A.Pythonの「f文字列（フォーマット文字列）」と完全に同じ機能。
    // Q.$はLinuxの変数自身へのアクセスと同じ？
    // A.LinuxのBashなどで変数を展開するときに $VAR_NAME や
    //  ${VAR_NAME} と書くのと全く同じ概念。
    // ブラウザに対して「ここからここまでの括弧の中身はただの
    // // 文字じゃなくて変数や計算式（評価される式）として処理して」と指示。
    // console.log(`${e.target.textContent}が${++counter} \
    //     回クリックされた`);
        //と記述すればtext変数宣言も不要とのこと。
    // console.log(text+'が'+ counter +10 +'回クリックされた');
    // // ↑ゲーム開始が010回クリックされた。
    // // +演算子が文字列の意味に解釈される。
    // console.log(text+'が'+ (counter +10) +'回クリックされた');
    // // ↑()で括れば数値同士の計算が先に評価される。
    // console.log(this.className);
    // // ↓コンソール表示結果
    // ゲーム開始
    // script.js:42 ゲーム開始クリックされた
    // script.js:43 btn-primary
// });
// ↑関数定義の時と違い実行なので最後に;が必要
// 文字列の結合は + で行える。
/*
◆処理の流れ（タイムライン）の完全解剖
このコードは、JavaScript特有の「イベント駆動（割り込み処理）」の定石です。
上から順番に実行されて終わるのではなく、
時間軸に沿って以下のフェーズで動きます。

●フェーズ①：割り込みの登録（待機）
startBtn.addEventListener('click', function(e){ ... });
ブラウザ（システム）に対して「startBtn（ボタン）に click という
割り込み信号が来たら、第二引数に書かれている function(e){...}
（割り込みハンドラ）を実行せよ」と予約・登録します。
この設定が終わると、JavaScriptのメイン処理は完了し、
ユーザーがクリックするまで静かに待機します。
●フェーズ②：発火とイベントオブジェクトの生成
ユーザーがボタンをクリックした瞬間、
ブラウザのシステムが割り込みを検知します。
この時、ブラウザは裏側で**「イベントオブジェクト（e）」という
詳細なレポートデータ（構造体）**を自動生成し、
登録しておいた無名関数に引数として投げ込みます
。
●フェーズ③：関数の実行（ハンドラ内部の処理）
ここからが無名関数の中身です。
const text = e.target.textContent;
e.target: レポートデータ e の中から
「最初にイベントが発生した要素（クリックの着弾点となった要素）への
ポインタ」を取得します
。
.textContent: その要素が持っている「要素内に含まれるテキストノードの
内容」というメンバ変数を読み取ります
。
取得した文字列（「ゲーム開始」）を新しく宣言した定数 text に代入
（格納）します。
※コメントの疑問への回答：
e.targetという書き方でオブジェクトが生成される？
 → いいえ、ここでは生成されていません。
 ブラウザが既にメモリ上に用意してくれた「レポートデータ e の中の
  target ポインタ」を読みに行っているだけです。
textcontentﾌﾟﾛﾊﾟﾃｨはHTMLのタグの中身が入るオブジェクト変数？ 
→ 大正解です！タグの中の文字データが入っているプロパティ（メンバ変数）です
。

console.log(text); // "ゲーム開始"
console.log(text+'クリックされた'); // "ゲーム開始クリックされた"
変数 text を出力し、次に + 演算子で文字列を結合して出力しています
。
console.log(this.className); // "btn-primary"
ここで登場する this は、イベント駆動特有の働きをします。
以前の解説の通りthis は「このイベントリスナー（監視カメラ）が
取り付けられている要素（つまり startBtn）」へのポインタとして機能します
そして .className は、その要素の class 属性の文字列を読み取る。
プロパティなので、「btn-primary」が出力されます。

3. function(e){} はイベントハンドラーか？
コメントにある推測の通り、大正解です。 
これは名前を持たない「無名関数」であり、addEventListener の
第二引数として渡されることで、イベント発生時に呼び出される
「イベントハンドラー」として機能しています
。C言語でいえば、関数ポインタとして「名前のない処理のブロック」を
直接渡しているイメージです。
*/

// -----------------------------------------
// ◆ステップ2：パズル盤面の動的生成
// -----------------------------------------
/*●60行付近、handleStartBtnClick(e){}内に、ｹﾞｰﾑ開始ﾎﾞﾀﾝ押下時に
難易度取得をする処理を記述していく。
htmlのid="grid-selectを使用して難易度選択された値を取得していく。
/*
function handleStartBtnClick(e){
    ～
    console.log(`${gridSelect.value}が選択された`)
}
●.valueプロパティ（HTMLSelectElement.value）
文字列でこのフォームコントロールの値を反映します。
選択されている option 要素があれば最初のものの value プロパティを返し、
そうでなければ空文字列を返します。
よって <select name="grid-select" id="grid-select">
        <option value="3">初級のvalueの3を取得する。

●次に難易度情報はほかの処理にも使うので、グローバル変数に格納する。
let gridSize; グローバル変数はコード上部40行付近にまとめる。
function handleStartBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
    gridSize = gridSelect.value;
    console.log(`${gridSelect.value}が選択された`)
}と関数内でグローバル変数に代入を行う。

●typeof演算子
（動的型付け言語で、ころころ中身の変わる変数の型を調べる為に使う）
console.log(`gridSizeの型は${typeof gridSize}です`)と記述を変更する
コンソール表示：gridSizeの型はstringです
結果は "string", "number", "boolean", "object", "function" などの
文字列として返ってきます。
ちなみにHTMLから取得したデータは「すべて文字列」になるので注意。
●データ型の変換方法
parseInt()
parseFloat()
Number()
+ (単項プラス演算子)※Number() の省略形（糖衣構文）
gridSize = +gridSelect.value;今回は単項プラス演算子を使用。
gridSizeの型はnumberです

●次にfunction initPuzzle(){}を作成する。93行辺り。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
}
    function handleStartBtnClick(e){
    console.log(`${e.target.textContent}がクリックされた`)
    gridSize = +gridSelect.value;
    console.log(`gridSizeの型は${typeof gridSize}です`)
    initPuzzle();
}
    ゲーム開始がクリックされた
script.js:67 gridSizeの型はnumberです
script.js:96 パズルピース総数は9枚です

●次にセクション２配下に、
    <div class="board-and-preview">
    <ol id="puzzle-board" class="puzzle-board">
        <!-- <li class="puzzle-piece"><div class="piece-image"></div></li>
        <li class="puzzle-piece">
●パズルピース要素が作成されるようにする。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    console.log(piece)
}
    ゲーム開始がクリックされた
gridSizeの型はnumberです
パズルピース総数は9枚です
 <li>​</li>​
とli要素が作成された。
●ただcreateElementは要素`作成`だけであり、配置はしてくれないので、
 HTML内の追加したい場所に要素を追加する処理を記述する必要がある。
 function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    puzzleBoard.appendChild(piece);
    console.log(piece)
}と記述するとli要素がブラウザ描画上に追加されているのが分かる。
1クリックで1要素追加される。
.apendChildは、
現在すでに画面に表示されているDOMツリー（puzzleBoard）の末尾
（子供のリストの一番最後）にポインタで連結（リンク）させる命令。
●パズルピースに白い枠を表示させる。
CSS 234行辺りに
.puzzle-piece {
    border: 1px solid #ffffff;
    overflow: hidden;
    position: relative;
の記述があるので、liにクラスpuzzle-pieceを適用させてやれば良い。
→classNameプロパティを使用する。
※class という単語はオブジェクト指向のクラス（設計図）を定義するための
予約語。なのでcss:classに対応した className という別名が与えられている。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    piece.className = 'puzzle-piece'
    //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
    puzzleBoard.appendChild(piece);
    console.log(piece)
}
●補足：より安全で便利な classList.add() メソッド
const piece = document.createElement('li');
piece.classList.add('puzzle-piece'); // クラスのリストに新しい名札を追加する
puzzleBoard.appendChild(piece);
【なぜ classList.add が推奨されるのか？】
className の弱点: これは「完全な上書き」です。
もしその要素が既に class="box red" という複数のクラスを持っていた場合、
piece.className = "puzzle-piece" とすると、元の box や red が
すべて消し飛んで puzzle-piece だけになってしまいます。
classList.add() の強み: これは「追加（Push）」です。
元々持っているクラスを壊さずに、新しいクラスだけを安全にリストに
追加してくれます。
●classNameに複数のクラス名を追加する
 (classList.add,.remove,.tuggle,containsメソッドを使う)
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    const piece = document.createElement('li');
    piece.classList.add('puzzle-piece')
    //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
    puzzleBoard.appendChild(piece);
    console.log(piece)
}
実行結果：
script.js:10 <section id=​"setup-area" class=​"space-y">​…​</section>​flex
script.js:65 ゲーム開始がクリックされた
script.js:67 gridSizeの型はnumberです
script.js:96 パズルピース総数は9枚です
script.js:102 <li class=​"puzzle-piece">​</li>​
↑きちんと生成された要素にクラスが追加されている。

●次に繰り返し分を用いて必要ピース枚数を一括で生成する(for,whileなど)
for文の書き方は基本的にC言語と変わらない。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列をｾｯﾄせよという命令
        puzzleBoard.appendChild(piece);
        console.log(piece)
    }
}
↓9個ピースが生成されたのが分かる。
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​
script.js:102 <li class=​"puzzle-piece">​</li>​

●最後のピースにだけ2つ目のクラスhiddenも併せて付与する。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) {
            // CSSで用意されている非表示用のクラス'hidden'を付与する
            piece.classList.add('hidden');
        }
        puzzleBoard.appendChild(piece);
        console.log(piece)
    }
}
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece">​</li>​
script.js:108 <li class=​"puzzle-piece hidden">​</li>​

●実際に画像を背景に表示してみる
CSS236行目付近 background-image: url("../images/dog.jpg");の
コメントアウトを解除。しかしこれだけでは画像が表示されない。
<li class="puzzle-piece"><div class="piece-image"></div></li>
li直下のdiv.piece-imageを追加する。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)
    for(let i = 0; i < totalPieces; i++){
        const piece = document.createElement('li');
        piece.classList.add('puzzle-piece')
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) {
            // CSSで用意されている非表示用のクラス'hidden'を付与する
            piece.classList.add('hidden');
        }
        puzzleBoard.appendChild(piece);
        const div = document.createElement('div')
        ⓵↑まずdiv要素を生成する。
        piece.appendChild(div)
        ⓶↑divをli要素piece直下に配置する
        div.classList.add('piece-image')
        ⓷↑divにクラスを追加してやる。
        console.log(piece)
    }
}
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece">​<div class=​"piece-image">​</div>​</li>​
script.js:111 <li class=​"puzzle-piece hidden">​<div class=​"piece-image">​</div>​</li>​
●補足：【プロの書き方（バッファ内で完成させてから出力する）】 
C言語の画面描画（ダブルバッファリング）と同じで「メモリ上で部品を
すべて完全に組み立ててから、最後に1回だけ画面（DOMツリー）に投下する」
のが最も高速で美しい処理順序です。
// 
1. メモリ上で部品を作る
    const piece = document.createElement('li');
    piece.classList.add('puzzle-piece');
    if (i === totalPieces - 1) piece.classList.add('hidden');
    const div = document.createElement('div');
    div.classList.add('piece-image');
// 2. メモリ上で親子を合体させる（まだ画面には出ない）
    piece.appendChild(div);
// 3. すべて完成した piece を、最後に画面（puzzleBoard）へ追加する！
    puzzleBoard.appendChild(piece);
このように「親（puzzleBoard） ＞ 子（piece） ＞ 孫（div）」という
階層構造を、底辺（孫）から順に組み立てて最後に親にくっつけるのが、
DOM操作の黄金律です。

●犬の画像は表示出来たが、犬でないユーザが選択した画像を
JavaScriptで選択出来る様にする。（予めHTMLに設定されたプロパティを
選択するだけでなく、書き換え自体を行う。）
●element.style の正体（＝インラインスタイルの直接書き換え）
JavaScriptの element.style.プロパティ名 を使って設定したスタイルは、
HTMLタグに直接 style="..." と書き込んだのと同じ「インラインスタイル」
として扱われる。
インラインスタイルはCSSファイルに書かれたどのルールよりも詳細度
（優先順位）が最も高くなるため、CSSファイルでどんな背景画像が
設定されていようと、JavaScriptのこの1行が絶対的な命令として
上書き（オーバーライド）します。
↓コンソール出力結果
script.js:116 <li class=​"puzzle-piece">
​<div class=​"piece-image" 
style=​"background-image:​ url("../​images/​dog.jpg")​;​">​</div>​</li>​
● div.style.backgroundImage = 'url("images/dog.jpg")' ;
　のurlの値を書き換える。
function initPuzzle(){
    const totalPieces = gridSize ** 2;
    console.log(`パズルピース総数は${totalPieces}枚です`)

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    ●const imgUrl = imageSelect.value
    ●console.log(imgUrl)
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        ●div.style.backgroundImage = `url("${imgUrl}")` ;

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！
        puzzleBoard.appendChild(piece);
        console.log(piece)
        }
}

●画像のURLは他でも使うので、宣言位置をグローバル変数に変える。
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
●let imgUrl;//中身を後で書き換えるのでletに。

function handleStartBtnClick(e){
    ●imgUrl = imageSelect.value;
}

function initPuzzle(){
    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    ●// グローバル変数にするため変数記述箇所を移動
    ●// さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    ●// imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動
    console.log(imgUrl)
    for(let i = 0; i < totalPieces; i++){
        }
}
↓問題なく画像が表示される。
script.js:125 <li class=​"puzzle-piece">​<div class=​"piece-image" 
style=​"background-image:​ url("images/​dog.jpg")​;​">​</div>​</li>​

●次、ゲーム開始を複数回を押されても、ピースが増えない様にする。
 →ゲーム開始ボタン押下時にパズルの画像(子要素)を消す処理を追加することで、
  押下時にもピースがさらに追加されないようになる。
●removeChild(..) メソッドによるノードの削除
ノードを削除することができます。以下のコードはテキストノード
myTextNode ("world" という単語を含む) を 2 番目の <p> 要素である
myP から削除します。
例文：secondParagraph.removeChild(myTextNode);
function initPuzzle(){
    // ↓追加するそうピース数(1辺の分割数の2乗でｓ算出)
    const totalPieces = gridSize ** 2;
    // console.log(`パズルピース総数は${totalPieces}枚です`)もういらないのでコメントアウト

    // ↓プルダウンで選択された画像URLを取得する。
    // ID.valueでオプション要素のvalue値にアクセス出来る。
    // 変数宣言はforの外で行う。
    // グローバル変数にするため変数記述箇所を移動
    // さらに画像が確定するのはゲーム開始ボタンが押下された後なので、
    // imgUrlに値が入るタイミングをfunciton handelstartbtnへ移動

    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
        // 1. メモリ上で部品を作る
        const piece = document.createElement('li');
        //HTMLのclass属性として"puzzle-piece"という文字列を
        // ｾｯﾄせよという命令
        piece.classList.add('puzzle-piece')
        // ↓ 最後の要素（空白ピース）だけ判定してhiddenを付与する。
        if (i === totalPieces - 1) piece.classList.add('hidden');
        // ↓3行はピースじょうの画像生成処理
        // (CSSスタイル適用の為にclass属性とstyle属性を設定)
        const div = document.createElement('div');
        div.classList.add('piece-image');
        // ↓犬の画像以外をcss:backgorund-imageに適用出来る様に、
        // ここで書き換える。代入は文字列でないと駄目なの注意。
        div.style.backgroundImage = `url("${imgUrl}")` ;
        // ↑ゲーム開始時に選択された画像を背景に設定

        // 2. メモリ上で親子を合体させる（まだ画面には出ない）
        piece.appendChild(div);
        // 3. すべて完成した piece を最後に画面（puzzleBoard）
        // へ追加する！子要素から順に追加すると、
        // 重い画面描画処理が最小で済む。
        puzzleBoard.appendChild(piece);
        console.log(piece)
        }
        ●puzzleBoard.removeChild(document.querySelector
            ('.puzzle-piece'))
        // query.selectorでは要素内の一番初めの要素を消すとのこと。
}
Q.document.querySelector()について大分忘れてしまった。
A.引数に渡された条件（CSSセレクター）に一致する要素を上から順に探し
「一番最初に見つかった要素へのポインタ（参照）」を1つだけ返すメソッド。
 しかしこれではまた繰り返さないとすべて削除できない。
●.removeChildではなく、repalceChildで繰り返し文を使わずに要素削除する
例：myNode.replaceChildren();
削除したい親要素に引数を使わずreplaceChildrenメソッドを
実行すると削除できるとのこと。※本来は引数に置き換える。
function initPuzzle(){
   ～
    ●// パズル盤面をクリアして何回押されてもピース増えない様にする
    ●puzzleBoard.replaceChildren();
    ～
    // ↓ピース追加処理の繰り返し（総ピース分繰り返す）
    for(let i = 0; i < totalPieces; i++){
       ～
        console.log(piece)
        }
        // puzzleBoard.removeChild(document.querySelector('.puzzle-piece')) replaceChildren();を使うのでコメントアウト
}

●次は、難易度×4,5を選択してゲーム開始をクリックすると
  分割が上手くいかない問題をしゅうせいする。
  CSS:root{}で  --grid-size: 3; パズルの1辺の分割数と設定されているのを
  動的にJSで書き換える。
function initPuzzle(){
    // ↓難易度に応じてパズルの分割数変更(CSSｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨを書き換える)
    // :root{--grid-size: 3;}選択するにはどうすれば良いか？
    console.log(document.documentElement)//←テスト
    // script.js:122 <html lang=​"ja">​view-sourcescroll
    // <head>​…​</head>​<body>​…​</body>​flex</html>​
    // ↑documentElementでhtml全要素が取得できる！
    // ※因みに※ document.body が <body> タグへのポインタになる。
    // ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    ※既存CSSﾌﾟﾛﾊﾟﾃｨなら、style.backgroundColor = ... のように直
    接メンバ変数として代入出来る。
    // ●setProperty('設定したいpropatyName', 変更したい値)
    ●document.documentElement.style.setProperty(
        '--grid-size', gridSize);についての文法
    ●.style （インラインスタイルの操作）
    犬の画像を背景設定した際に div.style.backgroundImage = ... と
    書いたのと同じ。取得した <html> 要素に対して HTMLのタグ内に
    直接 style="..." を埋め込む為のメンバが 要素.style でアクセス出来る
}

//------------------------------------
◆↓6/17水の授業の内容
【ステップ 2】パズル盤面の動的生成
パズルゲームの肝となる盤面（グリッド）をJavaScriptの繰り返し処理を使って
動的に組み立てます。
2.1 作業内容
済：難易度（パズルの1辺の分割数）に応じた総ピース数（1辺の分割数2）を求め、
  ループ処理を使って総ピース数分の <li> 要素を動的に生成してください。
●：各ピースの正しい位置（0 から 総ピース数-1 までのインデックス）を、
   後で判別できるように「カスタムデータ属性（data-correct-index）」として
   各要素に埋め込んでください。
済：最後の1ピース（右下のピース）は空白とするため、
    非表示用のクラスを適用させてください。
●：作成したピース群を順番にグローバルな配列「pieces」に保存し、
   パズル盤面上のピースの並び順を管理できるようにしてください。
●：「空白ピース」の位置（インデックス）を管理するグローバル変数
   「blankIndex」を作成してください。
//------------------------------------
●１．シャッフル時のピース位置を変えるグローバル変数 pieces を作成
// ４０行目辺り---------------------------------------
// グローバル変数の宣言を↓にまとめる
// -----------------------------------------
let gridSize; //ピースの分割数を表す変数。(選択された難易度)
let imgUrl;//中身を後で書き換えるのでletに。
●let pieces; //シャッフル時のピース並び順管理用配列

●2．initPuzzle関数内{}でpiecesを空の配列として初期化
※JSにはlist型などの配列型のようなデータ型はない。
  7つのプリミティブ型以外は、オブジェクトになる。
  下の記述、pieces = [];これはArryクラスから
  Arrayオブジェクトを生成していることになる。
  const array = new Array(arrayLength);でも配列を作ることができる。
   document.documentElement.style.setProperty(
        '--grid-size', gridSize);
    
140行目付近//↓ピース並び順管理配列を空の配列として初期化
    ●pieces = [];
    ●console.log(pieces) で出力してみると（確認用）
      ↓F12コンソールパズル開始押下後のログ
      []length: 0[[Prototype]]: Array(0) 
      ↑要素数ゼロのArrayオブジェクトが作られているのがわかる。
    ●console.log(pieces.length) //←配列の要素数を.lengthﾌﾟﾛﾊﾟﾃｨにｱｸｾｽして表示
    ※arrayには色々なﾒｿｯﾄﾞとﾌﾟﾛﾊﾟﾃｨが用意されている。
      ↓代表的なもの。
      要素を追加する場合はappendではなく、array.push("3");など
      array.pop();→最後の要素を取出す。引数はいらない。戻り値があるので代入可能
      array.shift();→popの逆、先頭の要素を取出す。引数なし。
      .unshift("1","2");→push("3");の逆。先頭に要素を追加する。

●        //148行目 ピースのｶｽﾀﾑﾃﾞｰﾀ属性に正しい位置(index)を保存
        // dataset.以降は好きな変数名を付ける(ｲﾝｽﾀﾝｽ変数を作成)
        // ピースを作成した順番は i と同じなので for中にiを代入
        ●piece.dataset.correctIndex = i;
        
        ↓コンソール結果、data-correct-index="x"が追加されているのがわかる。
        script.js:171 <li class=​"puzzle-piece" data-correct-index=​"0">​…​</li>​
script.js:171 <li class=​"puzzle-piece" data-correct-index=​"1">​…​</li>​

５．●【ステップ 3】スライド操作の実装
●プレイヤーがピースをクリックしたりキーボードを押したりしたときに、
    「そのピースが動かせる状態か」を算出し、配列内の位置を「スワップ」する
    アルゴリズムを構築します。
3.1 作業内容
●現在「空白ピース」が位置しているインデックス（blankIndex）を基準に、
    その上下左右に隣接しているピースのインデックスを計算して配列で返す
     getMovableIndices() 関数を作成してください。
●ユーザーが任意のピースをクリックした際、そのピースが上記で求めた
    「移動可能リスト」に含まれているかをチェックし、含まれていれば
    空白ピースと位置を入れ替える（配列内の要素をスワップする）処理を
    記述してください。

●jsフォルダの中に新しく model.js というファイルを作ってそちらで作業する。
 ※このままブラウザ画面ではステップ3の内容は作業しにくいとのこと。
   まずはコンソール上で動作させる。
●HTML<scriptのsorceにこのファイルを追加する。
 ※コンソールで動けばよいので type="module"は書かない
     <script type="module" src="js/script.js"></script>
12行目    ●<script src="js/model.js"></script>
●// console.log("model.js");
// ●まずは３＊３のパズルのつもりで作っていく。
// ●script.jsファイルと同じようにグローバル変数を宣言していく。
// ↓1辺の分割数
let gridSize = 3;
// ↓ピース並び順管理配列※ここでは実験なので、直接値書き込み
let pieces = ['１','２','３','４','５','６','７','８','　'];
// ↓空白ピース位置記憶用変数
let blankIndex = 8;
// ↑これでメインjsファイルと同じような条件を書けた。
/**
 * ピース管理配列内のピースを１辺の分割数に応じて、
 * ２次元でコンソールに出力する処理
function printPuzzle(){
    console.log(pieces);
    for (let i=0; i < gridSize**2; i+=gridSize){
        let tempArray = [];
        for(let j=0; j < gridSize; j++){
            // console.log(pieces[i+j],end="");
            tempArray.push(pieces[i+j]);
        }
        console.log(tempArray);
    }
}
●HTML<scriptのsorceにこのファイルを追加する。
 ※コンソールで動けばよいので type="module"は書かない
     <script type="module" src="js/script.js"></script>
12行目    ●<script src="js/model.js"></script>
●まずは３＊３のパズルのつもりで作っていく。

次●現在「空白ピース」が位置しているインデックス（blankIndex）を基準に、
    その上下左右に隣接しているピースのインデックスを計算して配列で返す
     getMovableIndices() 関数を作成してください。

// ↓空白を探してから求めなくて良いとのこと。なので没。
function getMovableIndices_test()
{   
    let blanekNeighbors = [];
    for(let i=0; i < gridSize; i++)
    {
        for(let j=0; j < gridSize; j++)
        {   
            console.log([i*gridSize+j])
            if (pieces[i*gridSize+j] == false) 
            {
                blankIndex = i*gridSize+j;
                console.log([blankIndex]);

                if(blankIndex % gridSize != 0){
                    blanekNeighbors.push(blankIndex-1);
                    console.log([blankIndex-1]);
                }
                if(blankIndex % gridSize != (gridSize-1)){
                    blanekNeighbors.push(blankIndex+1);
                    console.log([blankIndex+1]);
                }
                if(0 <= (blankIndex-gridSize)){
                    blanekNeighbors.push(blankIndex-gridSize);
                    console.log([blankIndex-gridSize]);
                }
                if((gridSize**2 - gridSize) > blankIndex){
                    blanekNeighbors.push(blankIndex+gridSize);
                    console.log([blankIndex+gridSize]);
                }
            }
        }
    }
    return blanekNeighbors;
}

// ↓グローバル変数blankIndexを元に出力が変わる様にとのことなので変更。
/**
 * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
 * @returns {Array<number>}移動可能なピースの位置index配列
 */ /*
function getMovableIndices()
{   
    let blanekNeighbors = [];

    if(blankIndex % gridSize != 0){
        blanekNeighbors.push(blankIndex-1);
        console.log([blankIndex-1]);
    }
    if(blankIndex % gridSize != (gridSize-1)){
        blanekNeighbors.push(blankIndex+1);
        console.log([blankIndex+1]);
    }
    if(0 <= (blankIndex-gridSize)){
        blanekNeighbors.push(blankIndex-gridSize);
        console.log([blankIndex-gridSize]);
    }
    if((gridSize**2 - gridSize) > blankIndex){
        blanekNeighbors.push(blankIndex+gridSize);
        console.log([blankIndex+gridSize]);
    }
    return blanekNeighbors;
}
/*
済：ユーザーが任意のピースをクリックした際、そのピースが上記で求めた
「移動可能リスト」に含まれているかをチェックし、
●含まれていれば
空白ピースと位置を入れ替える（配列内の要素をスワップする）処理を
記述してください。
*/
// /**
//  * 引数で指定されたピースが移動可能な場合のみ移動する処理
//  * @param {string} piece 移動対処ピースは文字列で渡すこと
//  */
// function tryMovePiece(piece){

// }
// -----------------------------------------
// ●↓180行目に7/1㈬modele.jsで作ったパズル移動関数を移植
// -----------------------------------------
// /**
//  * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
//  * @returns {Array<number>}移動可能なピースの位置index配列
//  */ 
// function getMovableIndices()
// {   
//     let blanekNeighbors = [];

//     if(blankIndex % gridSize != 0){
//         blanekNeighbors.push(blankIndex-1);
//         console.log([blankIndex-1]);
//     }
//     if(blankIndex % gridSize != (gridSize-1)){
//         blanekNeighbors.push(blankIndex+1);
//         console.log([blankIndex+1]);
//     }
//     if(0 <= (blankIndex-gridSize)){
//         blanekNeighbors.push(blankIndex-gridSize);
//         console.log([blankIndex-gridSize]);
//     }
//     if((gridSize**2 - gridSize) > blankIndex){
//         blanekNeighbors.push(blankIndex+gridSize);
//         console.log([blankIndex+gridSize]);
//     }
//     // blanekNeighbors.unshift(blankIndex);
//     return blanekNeighbors
// }
// /**
//  * 引数で指定されたピースが移動可能な場合のみ移動する処理
//  * @param {string} piece 移動対処ピースは文字列で渡すこと
//  */
// // const movalePieceStr = string(blanekNeighbors)
// // function tryMovePiece(movalePieceStr){
// //     for(let i=0; i < length(movalePieceStr); i++)
// //     {
// //     const movalePiecesClicker
// //     = document.querySelector(`.data-correct-index=${movalePieceStr[i]}`);
// //     }
// // }
// // ----------------------------------------------------
// // ↓前回独力で取り組んだが作ることは出来なかった。
// // 6月24日(水)はこの tryMovePiece関数の作成の続きから。
// // ----------------------------------------------------
// // const movalePieceStr = string(blanekNeighbors)
// // li.dataCorrectIndex.addEventListener('click' ,tryMovePiece);
// // function tryMovePiece(movalePieceStr){
// //     if (li.dataCorrectIndex === movalePieceStr) {
// //         // ↑クリックされたのが動かせる配列リストindexと一致するならと書きたいのだけれど、、、

// //         // ↑クリックされたピースと空白の位置を入れ替える
// //         blankIndex,movalePieceStr[動かせる配列index] = movalePieceStr[動かせる配列index],blankIndex;        
// //         // ↑blankとの配列番号を入れ替える。
// //     }
// // }
// let wantMovePiece = '８';
// function tryMovePiece(wantMovePiece){
//     // ●↓この関数を作る上で役に立つarrayｵﾌﾞｼﾞｪｸﾄメソッドの紹介
//     // includes()：配列の中に特定の要素が含まれているかどうかを
//     //             true or false で返してくれる。
//     // indexOf()：arrayの中から対象の要素の場所を教えてくれる。
//     //          対象の要素が含まれていないときは -1が返ってくる。
//     // ●↓どう使うか？
//     // １．indexOf()を使ってユーザーが動かしたい！と選択したピースが
//     //     ピースがピース管理配列上のどの位置にあるか＝インデックスを
//     // 取得する。
//     // ２．前回作ったgetMovablesIndices()を 使って、移動可能な
//     //     ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列を取得。
//     // ３．includes()を使って、移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ配列に、
//     //     移動させたいﾋﾟｰｽｲﾝﾃﾞｯｸｽが含まれるかを確認すれば良い。
//     // ４．含まれていた場合は、移動させたいピースと移動可能ﾋﾟｰｽｲﾝﾃﾞｯｸｽ
//     //     の位置をスワップすればOK。
//     console.log(`動かしたいピースは${wantMovePiece}`);
//     console.log(`piecesの１次元配列表示：${pieces}`);
//     let cpIndex = pieces.indexOf(wantMovePiece);
//     console.log(`選択されたピース(cp※chiced piece)は：${cpIndex}`);
//     let movableIndexies = getMovableIndices();
//     console.log
//     (`動かせるピースの位置(movableIndexies)は：${movableIndexies}`);
//     if (movableIndexies.includes(cpIndex)){
//         movePiece(cpIndex,movableIndexies)
//         // movePiece(cpIndex);
//         // ↑ なぜ引数が足りないのに動く（エラーにならない）のか？
// // 呼び出し側（引数は1つだけ）
// // movePiece(cpIndex);
// // 定義側（引数は2つ待っている）
// // function movePiece(cpIndex, mov) { ... }
// // C言語であれば、コンパイル時に「引数の数が合わない！」と即座に弾かれます。しかし、JavaScriptは実行時にクラッシュしないように作られた言語であるため、引数の数が合わなくても一切エラーになりません。
// // 【裏側で起きている物理演算】 JavaScriptでは、関数を呼び出した時に「渡されなかった引数」があった場合、ブラウザが勝手に気を利かせて**「足りない仮引数には undefined（未定義）という特殊な値を代入しておく」**という処理を行います
// // 。
// // つまり、今回裏側では movePiece(7, undefined); という形で関数が実行されていたため、プログラムが停止することなく動いていたのです。
//     } else {
//         console.log("そのピースは動かせません。\
//             wantMovePieceに違うピースインデックスを代入してください。");
//         console.log(getMovableIndices());
//     }
//     printPuzzle();
//     console.log(`現在の動かせるピースは：${getMovableIndices()}`);
// }
// /**
//  * ﾋﾟｰｽ管理配列内で引数で指定されたｲﾝﾃﾞｯｸｽ要素と
//  * 空白ﾋﾟｰｽを交換する処理をする関数
//  * @param {number} index 移動ピースのｲﾝﾃﾞｯｸｽを渡す
//  */
// function movePiece(cpIndex,movableIndexies){
//     // 「入れ子（2重関数定義）」になっていない独立した関数同士では、
//     // 必ず【実行時に実引数として渡し、仮引数で受け取る】必要がある。
//     [pieces[blankIndex], pieces[cpIndex]] =
//         [pieces[cpIndex], pieces[blankIndex]];
//     blankIndex = cpIndex;
//     console.log(`blankIndexを更新しました：${blankIndex}`);
//     console.log(cpIndex,movableIndexies); 
//     console.log(pieces);//←デバック用
//     console.log("ピースを入れ替えました。");  
// }
// // ↑移植関数ここまで
// // -----------------------------------------
// function printPuzzle(){
//     console.log(pieces);
//     for (let i=0; i < gridSize**2; i+=gridSize){
//         let tempArray = [];
//         for(let j=0; j < gridSize; j++){
//             // console.log(pieces[i+j],end="");
//             tempArray.push(pieces[i+j]);
//         }
//         console.log(tempArray);
//     }
// }
// // ●313行目↑7/1printPuzzleも追加。
/*
//●173行目辺り ↓7/1 パズルピースがクリックされた時の移植した3つの関数を
        // 呼び出す処理を記述する。各piece一枚一枚はforの中で
        // 変数pieceによって管理されている。
        piece.addEventListener('click', function(){
            tryMovePiece(piece);
            // tryMovePiece()が期待する仮引数は、動かしたいﾋﾟｰｽの
            // そのものの番号stringだがJSは動的型付け言語なので、
            // 引数の型はチェックしない。
            // 探される側： pieces 配列（画面にある9個の li 要素のポインタの集まり）
            // 探すもの： wantMovePiece（今まさにクリックされた li 要素のポインタ）
            // DOM要素をそのまま渡してDOM要素を探す。という処理に自然に変わっている。
        })
// ●これで中身の内部データとしてはパズルの動きが処理できるようになった。
// ●次に画面上のモデル上の動きに反映されるようにする。
// ●どのように実現するか？
// ●各ﾋﾟｰｽにはstyleプロパティがインラインでtransformが設定されている。
// ●→クリックされたときにその分移動させる処理を作っていくとのこと。 
◆334行目付近【ステップ 4】アニメーションとスワップ処理
配列の要素が入れ替わっただけでは、画面上のピースは動きません。
DOM要素の並び順を変えずに、CSSを使って滑らかなアニメーション移動を
実現します。
4.1 作業内容
パズルの各ピースのCSS位置移動を反映させる
 updatePiecePosition(index) 関数を作成してください。
ピース要素が本来表示されるべき「初期位置（correctRow, correctCol）」
と、現在のパズル配列内の「現在の位置（row, col）」の差分を
計算してください。
その差分をパーセンテージ（100% 単位）に変換し、
ピース要素の style.transform に対し translate(X, Y) を動的に
指定してください。
4.2 ヒント
例えば、現在の列（col）が 1 で、初期の列（correctCol）が 2 だった場合、
左方向に1マス分ずれていることになります。
移動量は (1 - 2) × 100% = -100% となります。
CSSの transform プロプロティをJavaScriptから文字列テンプレート
（バッククォート ` を使用）を用いて書き換える方法を調べてみましょう。

// ----------------------------------------------------
// ★7月8日(水)6，7限は↓ここから
// しばらくpuzzleから離れて、JSの非同期処理について学習
// 今回は、その学んだ内容を活かして、項目７．シャッフル処理について
// やっていくとのこと。
// ----------------------------------------------------
⚠シャッフル時に本来なら移動できないピース同士を入れ替えてしまうと、
　絶対にクリアできないパズルができてしまう。
⇒乱数は利用するが、あくまで移動できる範囲内で移動を繰り返すことが大事。
●シャッフル用の関数 shufflePieces(){}を作成。
// ↓ ●7/6追加関数。tryMoveの上248行目辺り。
// /**
//  * 移動可能なピースをランダムに選択して複数回の移動を繰り返す処理
//  */
// function shufflePieces(){
//     const shuffleSteps = gridSize**2*4;
//     // ↑シャッフルの回数を保存しておく変数。難易度で変わる様にする。
// }
// */
    // initPuzzle();
    // // ↑パズル初期化関数の実行
    // // ↓79行目 initPuzzle()の下に shufflePieces()を追加する。
    // shufflePieces()
//     // ↓ ●7/6追加関数。
// /**
//  * 移動可能なピースをランダムに選択して複数回の移動を繰り返す処理
//  */
// function shufflePieces(){
//     const shuffleSteps = gridSize**2*4;
//     // ↑シャッフルの回数を保存しておく変数。難易度で変わる様にする。
//     // ↓このfor文上限に↑の数をセットして中でランダムにピースの移動を繰り返す。
//     for (let i=0; i<shuffleSteps; i++){
//         // ★中に書き込む必要な処理を細かく分けて書き込んでみる。

//         // １．移動可能なピースを取得する⇒getMovableIndicies()を使用する。
//         // let movableIndices = getMovableIndices();
//         // console.log(movableIndices);
//         // ２．乱数を生成して移動可能なピースのｲﾝﾃﾞｯｸｽのいずれかを選択する。

//         // ↓これでは無駄が多いので改良
//         // console.log(pieces.length);
//         // let randomChiceIndex = Math.floor(Math.random()*(pieces.length-1));
//         // console.log(randomChiceIndex);
//         // if(movableIndices.includes(randomChiceIndex)){
//         //     movePiece(randomChiceIndex,movableIndices);
//         // }else{
//         //     i--;
//         // }
//         // ３．選択されたピースを移動する⇒movePiece()を使う。
//         // movePiece();

//         // let randomResult = Math.random();
//         // let randomDelimiter = 1/movableIndices.length
//         // // ex:0.3なら、/2したら0.15
//         // // randomResult < randomDelimiter
//         // // randomDelimiter <= randomResult < randomDelimiter *2
//         // // randomDelimiter*2 <= randomResult < randomDelimiter *3
//         // // randomDelimiter*3 <= randomResult <randomDelimiter *4
//         // if(movableIndices.length>=4){
//         //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
//         //     else if(randomDelimiter <= randomResult < randomDelimiter *2){movePiece(movableIndices[movableIndices.length-2],movableIndices);}
//         //     else if(randomDelimiter*2 <= randomResult < randomDelimiter *3){movePiece(movableIndices[movableIndices.length-3],movableIndices);}
//         //     else{movePiece(movableIndices[movableIndices.length-4],movableIndices);}
//         // }
//         // else if(movableIndices.length>=3){
//         //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
//         //     else if(randomDelimiter <= randomResult < randomDelimiter *2){movePiece(movableIndices[movableIndices.length-2],movableIndices);}
//         //     else{movePiece(movableIndices[movableIndices.length-3],movableIndices);}
//         // }
//         // else {
//         //     if(randomResult < randomDelimiter){movePiece(movableIndices[movableIndices.length-1],movableIndices);}
//         //     else{movePiece(movableIndices[movableIndices.length-2],movableIndices);}
//         // }
//         // if文の地獄だがこれでもなんとか動いた、、、。がパズルの0行目が全く動かなかった。

        // for (let i=0; i<shuffleSteps; i++){
//         // ↓★正解の一番すっきりしたコード
//         // １．移動可能なピースのインデックス配列（候補リスト）を取得する
//         let movableIndices = getMovableIndices();
        
//         // ２．候補リストの「長さ」を掛けて切り捨てることで、
//         // 0 〜 (length-1) の安全なランダムポインタ（配列の要素番号）を生成する
//         let randomPointer =
//          Math.floor(Math.random() * movableIndices.length);
        
//         // ３．生成したポインタを使って、配列から「実際に動かすピースの番号」を抽出
//         let targetIndex = movableIndices[randomPointer];
        
//         // ４．ピースを移動
//         movePiece(targetIndex, movableIndices);


//     }
// }
// ----------------------------------------------------
// ★7月9日(木)4，5限は↓ここから
// 昨日はパズル開始ボタン押下時にランダムシャッフル処理を実装
// ◆しかし課題あまりシャッフルされないことがある
// ⇒前回移動したピースが選ばれることがあるので、それ記憶させ除外する。
// ----------------------------------------------------
// ----------------------------------------------------
// ★7月14日(火)1限は↓ここから
// 前回：移動したピースをシャッフルから除外する処理を実装した。
// しかし、じつはその処理を1行で書くことのできるメソッドがあるとのこと。
// Array.prototype.filter()メソッド。
// ----------------------------------------------------
//  // -----------------------------------------
//         // 7/15水ここから
//         // waitなど関数を使わずに、直接Promiswを続けても良いとのこと
//         // ↓ 先生の書き方。
//         // -----------------------------------------
//         // delayTimeﾐﾘ秒経過したら、完了するPromiseを作成し、
//         // その完了を await で待機する。
//         await new Promise((resolve, reject)=>{
//             // Promiseの中の処理には delayTimeミリ秒後に完了(成功)を通知する
//             // 処理を記述すれば良い。
//             setTimeout(() => {
//                 // その為にはsetimeoutを記述し、その中でresolveを書けば良い。
//                 // resolve()の引数を渡す時は、成功の通知と 一緒に 実行の結果など
//                 // を使いたい場合に渡す。ただ、今回はただ待つだけで良いので
//                 // 何も渡さなくて良い。
//                 resolve();
//             }, delayTime);
//         })
//         // -------- ↓ 更に省略して書いたパターン---------------------------------
//         await new Promise((resolve)=>setTimeout(resolve, delayTime));
//             // setTimeoutの第一引数には第二引数で指定した時間経過後に実行してほしい
//             // 関数を書くが、resolveしかしないので、関数自体を渡す形にしてしまってよい。
//             // 更にPromiseで完了したか判断する処理も1行にまとめて{}を省略して良い。
//             // 更に reject は使っていないので、resolveだけ受け取れば良い。   
// ------------------------------------------------------------
// ◆ 7/15水、次。難易度によってはシャフルする時間が長すぎるのを変更する。
// ⇒262行付近delayTimeを固定値ではなくて、計算で求めるようにする。
// ----------------------------------------------------------------------- 
// // 3*3の時のシャッフル回数＝36回＝3600ミリ秒、なので、
// delayTime = 3000/shuffleSteps; としてみる。
// ⇒上級を選ぶと同時に何ピースも動いてしまっている。
// ⇒実際にピースが動くに掛かる時間と、待機時間がずれてしまっているため。
// ⇒実際にピースが動く時間はcssのカスタムプロパティで100msで管理している。
// ◆ 7/15水、次。難易度によってはシャフルする時間が長すぎるのを変更する。
// ⇒262行付近delayTimeを固定値ではなくて、計算で求めるようにする。
// ----------------------------------------------------------------------- 
// 3*3の時のシャッフル回数＝36回＝3600ミリ秒、なので、
// const delayTime = 3000/shuffleSteps;
// ⇒上級を選ぶと同時に何ピースも動いてしまっている。
// ⇒実際にピースが動くに掛かる時間と、待機時間がずれてしまっているため。
// ⇒実際にピースが動く時間はcssのカスタムプロパティで100msで管理している。
// ⇒◆CSSのカスタムプロパティの値をJSから変更してやる必要がある。
    //※documentElementでhtml全要素が取得できる
    //※ ｶｽﾀﾑﾌﾟﾛﾊﾟﾃｨはID属性の様に自動でキャメルケース表記に
    // 変換してくれないので、他の方法を使用する必要がある。
    //● ⇒普通のプロパティはどのように選択、追加していたっけ？
// 130行目あたりの initPuzzle()内の
// document.documentElement.style.setProperty('--grid-size', gridsize)
// document.documentElement.style.setProperty(
//     '--piece-move-duration', `${delayTime}ms`)
// ↑ これで難易度を変えてもシャフル時間が等しくなった。
// ◆しかし、これによって高難易度では、ゲーム時のクリックの動きまで早くなってしまった。
// シャフル処理終了後に ↓ の様に戻してやれば達成できるが、
// もし後でカスタムプロパティを変更したい場合に2か所変更しないといけない。
// それは、ハードコーディングと言い、保守性が低下して良くないとのこと。
// document.documentElement.style.setProperty(
    // '--piece-move-duration', `100ms`)
// ★この時のHTMLの記述に注目　F12でみると、　
// <!DOCTYPE html>
// html lang syle"""~とhtml要素のインライン要素として上書きされている。
// ⇒★なので設定したHTMLのstyle属性を削除してやれば、CSSの設定に戻る！
// shufflePuzzle()のfor文を抜けた最後の1行に
// document.documentElement.style.removeProperty('--piece-move-duration');
// とプロパティを削除する記述を書いてOK！
//-----------------------------------------------------------------------
// ◆次ステップ5
//   ゲームステータス管理と表示画面の切り替えを出来るようにする。
// ----------------------------------------------------------------
// function handleStartBtnClick(e){
//     // ↓log主力は画像選択実装時で不要になったのでコメントアウト
//     console.log(`${e.target.textContent}がクリックされた`)
//     gridSize = +gridSelect.value;
//     // console.log(`gridSizeの型は${typeof gridSize}です`)
//     imgUrl = imageSelect.value;
//     // ↑グローバル変数に画像のURLを代入。
//     // HTMLSelectElement.valueとは：
//     // 文字列でこのフォームコントロールの値を反映します。
//     // 選択されている option 要素があれば最初のものの value プロパティを
//     // 返し、そうでなければ空文字列を返します。

//     // -7/15水曜日追記箇所：ステップ5画面切り替え処理----------------------------------------
//     switchArea(gameArea);
    // ------- ↓ 7/15水追加---------------------------------------
// /**
//  * ◆画面に表示するエリアの切替処理をする関数
//  * activeArea に指定されたエリアを画面に表示し、その他のエリアは非表示にする処理。
//  * ※各sectionにclass ="hidden"属性を付与する。 
//  * const setupArea = document.querySelector('#setup-area');
//  * const gameArea = document.querySelector('#game-area');
//  * const clearArea = document.querySelector('#clear-area');
//  * ↑コード上部で先に取得していたエリア要素を利用する。
//  * @param {Element} avtiveArea HTMLの要素＝画面に表示したいエリアを引数で受取る
//  */
// function switchArea(activeArea){
//     // ●１．handleStartBtnClick()内※スタートボタンが押された時に実行される
//     // 関数。これのinitPuzzle()の処理行前に、このswitcArea()が呼び出される様にする
//     // setupArea.className ="space-y hidden";
//     setupArea.classList.add("hidden");
//     gameArea.classList.add("hidden");
//     clearArea.classList.add("hidden");
//     console.log(activeArea);
//     activeArea.classList.remove("hidden");
// }
// ◆↑思いつかなかったなぁ。全部一度非表示にして。引数をswitchAreaに渡す時に
//   startbtnで呼び出されたから、e からどうやって目的のエリアに行くかと、
//   うんうんうなって詰まってしまったなぁ、、、。
//-----------------------------------------------------------------------
// ◆次
//   シャフル中にピースをクリックして移動出来てしまはないようにする。
// 　⇒その為にステータス(状態)の管理が必要になる。
// ----------------------------------------------------------------
// ●グローバル変数30行目くらいに
// let gameStatus; を追加。
// 状態を管理する時は、変数に何の値を入れるかは決まっていないが、
// 数字を入れて管理するのが一般的とのこと。
// ※ただし数字だけでは、その数字が何を意味するかをソースコード上できちんと
// 定義しておかないといけない。
// ●ほかの言語では enum関数など番号に名前を振る機能が用意されているが、
//  JSでは無いので、ステータスと名前を管理するオブジェクトを別に用意する。
// -----------------------------------------------------------
// 7/15水 ゲーム状態遷移制御の為の定数を作成
// ↓ ゲームステータスを示す定数の定義
// -----------------------------------------
// const statuses = { //←変数を宣言して{}をつけることでオブジェクトになる。
//     setuping: 0,    //設定中
//     shuffling: 1,   //シャッフル中
//     playing: 2,     //プレイ中
//     cleared: 9      //クリア後
// }
// ※使い方例 設定中なら、
//  gameStatus = 0;  にしておく。
// ----↓追記内容-----------------------------------------
// function handleStartBtnClick(e){
//     // ↓log主力は画像選択実装時で不要になったのでコメントアウト
//     console.log(`${e.target.textContent}がクリックされた`)
//     gridSize = +gridSelect.value;
//     // console.log(`gridSizeの型は${typeof gridSize}です`)
//     imgUrl = imageSelect.value;
//     // ↑グローバル変数に画像のURLを代入。
//     // HTMLSelectElement.valueとは：
//     // 文字列でこのフォームコントロールの値を反映します。
//     // 選択されている option 要素があれば最初のものの value プロパティを
//     // 返し、そうでなければ空文字列を返します。

//     // 7/15水：ゲームステータスの更新
//     gameStatus = statuses.shuffling;
//     console.log(`現在のgameStatusは${gameStatus}`);

//     // -7/15水曜日追記箇所：ステップ5画面切り替え処理----------------------------------------
//     switchArea(gameArea);
//     // -----------------------------------------

//     initPuzzle();
//     // ↑パズル初期化関数の実行
//     // ↓79行目 initPuzzle()の下に shufflePieces()を追加する。
//     shufflePieces()

//     // 7/15水：ゲームステータスをシャッフル中からプレイ中に
//     gameStatus = statuses.playing;
//     console.log(`現在のgameStatusは${gameStatus}`);
// }
// -----------------------------------------
// ◆課題：shuffleを非同期にしてしまったので、
//   shuffle処理が終わる前にステータスが変わってしまう。
// ⇒async function handleStartBtnClick自体をasyncにして 
// awasit shufflePiece();にしてやればよい。
// ---------------------------------------
// async function handleStartBtnClick(e){
//     // ↓log主力は画像選択実装時で不要になったのでコメントアウト
//     console.log(`${e.target.textContent}がクリックされた`)
//     gridSize = +gridSelect.value;
//     // console.log(`gridSizeの型は${typeof gridSize}です`)
//     imgUrl = imageSelect.value;
//     // ↑グローバル変数に画像のURLを代入。
//     // HTMLSelectElement.valueとは：
//     // 文字列でこのフォームコントロールの値を反映します。
//     // 選択されている option 要素があれば最初のものの value プロパティを
//     // 返し、そうでなければ空文字列を返します。

//     // 7/15水：ゲームステータスの更新
//     gameStatus = statuses.shuffling;
//     console.log(`現在のgameStatusは${gameStatus}`);

//     // -7/15水曜日追記箇所：ステップ5画面切り替え処理----------------------------------------
//     switchArea(gameArea);
//     // -----------------------------------------

//     initPuzzle();
//     // ↑パズル初期化関数の実行
//     // ↓79行目 initPuzzle()の下に shufflePieces()を追加する。
//     await shufflePieces()

//     // 7/15水：ゲームステータスをシャッフル中からプレイ中に
//     gameStatus = statuses.playing;
//     console.log(`現在のgameStatusは${gameStatus}`);
// }

// -----------------------------------------------------------
// 7/21火 午前授業内容ここから
// ●設定に戻るでシャッフル2重処理がおこなわれてしまうのを止める
// ◆【手数の更新】
// ●手数を数える為のグローバル変数を作成。
// 64行目辺り、let moveCount;
// ↑ 7/21火 ゲーム時に動かしたピースの数を数えるカウンター変数を設置。
// ・ゲームが開始されたらmoveCountを0に初期化
//   ⇒handleStartBtn(e){}中(initPuzzleなどが呼ばれる)で、moveCount = 0;
//     と言う初期化処理をする。function initPuzzleの中で
//     Piec.addEventListener('click'),fnciton(){tryMovePiece(piece)で
// 　　 }ピースを動かす処理が記載されているので、この中で一つの処理＝ピースを
//     動かす処理が終わったら moveCountをインクリメントしてやれば良い。
// 　　※そう言えばなぜinitPuzzleの中でピースを動かす処理も組み込んでいるのだっけ？
// 　　⇒tryMoveの中のmovePiece処理が終わった段階で moveCountをインクリメントするの
// 　　　のが良さそう。
// 　　⇒このすぐ次に  <p>手数: <span id="move-counter">0</span>回</p>
//      なので、moveCounter.textContent = str(moveCount):？
//      str()ではundefineとなる✖。moveCounter.textContent = '${moveCount}';
// 　　 では、手数: ${moveCount}回となってしまう⇒失敗。
// 　　⇒moveCounter.textContent = moveCount;シンプルにこれで良かった。
// 　　⇒関数化がまだ出来ていない。また、設定に戻る⇒ゲーム開始ボタン押下時に、
//      ｽﾃｰﾀｽﾊﾞｰのカウントがまだ9回のままなので、
//      moveCount.textContent =  moveCount;をmoveCount = 0;の直下に合わせて記述
// 　　 してｽﾃｰﾀｽﾊﾞｰも初期化をする。
// ・クリックによってピースが移動されたらmoveCountをインクリメント
// ・moveCountの更新と同じタイミングでステータスバーの手数の表示を更新。
// ・updateMoveCount(count)関数を作り、その中でｽﾃｰﾀｽﾊﾞｰの手数の表示を更新。
// ⇒より汎用的に手数の更新を変えられるようにするには、呼び出し時のgamestatusによって
// 　処理が変わるステートマシンとして記述する？gamestatusはグローバル変数だから、
// 　引数として受け取る必要は無いのかな。
// ⇒upadateMoveCount(✖moveCount){
//      if(gamestatus===statuses.setuuping){
//          moveCount = 0;
//          moveCounter.textContent = moveCount;
//      }
//      else if(gamestatus===statuses.playing){
//          moveCount++;
//          moveCounter.textContent = moveCount;
//      }
// }
// ⇒function upadateMoveCount(){moveCountはグローバル変数なのでシャドーイングが
// 　起きないように、グローバル変数をいじる関数は引数でグローバル変数を渡さない。

// ◆【時間の更新】の記述方針
// ・グローバル変数：elapsedSeconds（経過時間）を宣言する。
//   ⇒66行目辺り let elapsedSeconds;
// ・ゲーム開始がされたら、elapsedScondsを0に初期化。
// ・シャッフルが終わったらstartTimer()関数を実行
// ・startTimer関数を作り、その中でインターバル処理を使って1秒おきに
// 　elapsedSecondsをインクリメント。
// ・elapsedSecondsの更新と同じタイミングでupdateTimer(seconds)関数を実行。
// ・upadateTimer(seconds)関数を作り、その中でｽﾃｰﾀｽﾊﾞｰの時間にsecondsを反映する。
// ⇒全て関数化するとして処理を記述してみる。
// 
// 67行目let elapsedSeconds;
// 68行目let intervalID;
// 
// --↓ 7/22水曜日ここから---------------------------------------
// 833行目辺り function startTimer(){
//      elapsedSeconds = 0;
//      timer.textContent = elapsedSeconds;
//      intervalID = setInterval(updateTimer, 1000);
//     }
// function updateTimer(){
//          ++elapsedSeconds;
//          timer.textContent = elapsedSeconds;
//         }
// function resetTimer(){
//     clearInterval(intervalID);
//     elapsedSeconds = 0;
//     timer.textContent = elapsedSeconds;
// }
// }
// ↓ 91行目
// async function handleStartBtnClick(e){
//     // e は Event（イベント）オブジェクト。
//     // そして、その中に入っている e.target が Element（HTML要素）。
    
//         // ↓log主力は画像選択実装時で不要になったのでコメントアウト
//     console.log(`${e.target.textContent}がクリックされた`)
//     gridSize = +gridSelect.value;
//     // console.log(`gridSizeの型は${typeof gridSize}です`)
//     imgUrl = imageSelect.value;
//     // ↑グローバル変数に画像のURLを代入。
//     // HTMLSelectElement.valueとは：
//     // 文字列でこのフォームコントロールの値を反映します。
//     // 選択されている option 要素があれば最初のものの value プロパティを
//     // 返し、そうでなければ空文字列を返します。

//     // 7/15水：ゲームステータスの更新
//     gameStatus = statuses.shuffling;
//     console.log(`現在のgameStatusは${gameStatus}`);
//     updateStatusName();

//     // -7/22水追記----------------------------------------
//     resetTimer();

//     // -7/15水曜日追記箇所：ステップ5画面切り替え処理----------------------------------------
//     switchArea(gameArea);
//     // -----------------------------------------

//     initPuzzle();
//     // ↑パズル初期化関数の実行
//     // ↓79行目 initPuzzle()の下に shufflePieces()を追加する。
//     await shufflePieces()

//     // 7/22水追記カウンター処理
//     startTimer();

//     // 7/15水：ゲームステータスをシャッフル中からプレイ中に
//     gameStatus = statuses.playing;
//     console.log(`現在のgameStatusは${gameStatus}`);
//     updateStatusName();
// }
// ----------------------------------------------------------------------------------
// 60秒で1分に切り替わる＆0埋め＆00分00秒表記になるように調整。
// ----------------------------------------------------------------------------------
// let elapsedSeconds;
// let intervalID;
// 69行目let elapsedMinutes;を追加。
// let strElMi;
// let strElSec;
// let timeString;

// function startTimer(){
//      elapsedSeconds = 57;
//      elapsedMinutes = 0;
//      strElMi = elapsedMinutes.toString().padStart(2, 0);
//      strElSec = elapsedSeconds.toString().padStart(2, 0);
//      timeString = `${strElMi}分${strElSec}秒`;
//      timer.textContent = timeString;
//      intervalID = setInterval(updateTimer, 1000);
//     }
// function updateTimer(){
//     elapsedSeconds++;
//     if(elapsedSeconds >= 60){
//         elapsedMinutes++;
//         elapsedSeconds = 0;
//     }
//     strElMi = elapsedMinutes.toString().padStart(2, 0);
//     strElSec = elapsedSeconds.toString().padStart(2, 0);
//     timeString = `${strElMi}分${strElSec}秒`;
//     timer.textContent = timeString;
//     }
// function resetTimer(){
//     clearInterval(intervalID);
//     elapsedSeconds = 0;
//     elapsedMinutes = 0;
//     strElMi = elapsedMinutes.toString().padStart(2, 0);
//     strElSec = elapsedSeconds.toString().padStart(2, 0);
//     timeString = `${strElMi}分${strElSec}秒`;
//     timer.textContent = timeString;
// }
// ----------------------------------------------------------------------------------
// --↓ 7/22水 分用の変数を用意せず割り算でやってみる。---------
// function startTimer(){
//      elapsedSeconds = 57;
//      renderTimer(elapsedSeconds);
//      intervalID = setInterval(updateTimer, 1000);
//     }
// function updateTimer(){
//     elapsedSeconds++;
//     renderTimer(elapsedSeconds);
//     }
// function resetTimer(){
//     clearInterval(intervalID);
//     elapsedSeconds = 0;
//     renderTimer(elapsedSeconds);
// }
// function renderTimer(elapsedSeconds){
//     strElMi = (elapsedSeconds%60).toString().padStart(2, '0');
//     strElSec = Math.floor(elapsedSeconds/60).toString().padStart(2, '0');
//     timeString = `${strElMi}分${strElSec}秒`;
//     timer.textContent = timeString;
// }
// ◆なぜシャッフル中に戻るを押すとタイマーが二重に起動してしまうのか。
// なぜ「戻る」を押すと startTimer が実行されてしまうのか？
// 原因は、先日実装した**「シャッフルを中断する処理」**にあります。
// // shufflePieces() の中身
// if(gameStatus !== statuses.shuffling){
//     return; // ← ★これが原因！
// }
// 
// --- ↓ 7/22水 先生の模範解答--------------------------------------
// /**
//  * 1秒置きに経過時間を更新する処理
//  */
// function startTimer(){
//     setInterval(() => updateTimer(++elapsedSeconds), 1000);
// }

// /**
//  * 実行中の経過時間表示用のインターバルを停止する処理
//  * もしインターバルが走っていない時に呼ばれた時もエラーにならないようにする。
//  * 使うタイミング2パターンある。
//  * 設定戻る押下時に呼び出す:handleBackBtn()内に記述。
//  * 
//  */
// function stopTimer(){
//     if(timerTntervalID===null) return; //何もしないで呼出元に戻る。
//     clearInterval(timerTntervalID);
//     timerTntervalID = null; //インターバルIDをnullに戻しておく。
// }

// /**
//  * 経過時間をステータスバーの時間に表示する処理
//  * @param {number} seconds 経過時間（秒）
//  */
// function updateTimer(seconds){
//     timer.textContent = formatTime(seconds);
// }
// /**
//  * secondsを分と秒のフォーマットに変換する処理
//  * @param {number} seconds 
//  * @returns {string} 分と秒を'00:00'の形式に変換した文字列
//  * 👆戻り値がある場合はJSDOCsでこの様に書く。データ型は{}に。
//  */
// function formatTime(seconds){
//     // let min = Math.floor(seconds/60);
//     // let sec = (seconds%60);
//     // min = String(min); //String関数を使う場合は戻り値が返って来るので変数で受け取る
//     // sec = String(sec); //この関数内だけの処理なのでmin,secを上書きしてしまう。
//     // min = min.padStart(2, '0'); //str.padStart()メソッドも戻り値を返すので、また上書き
//     // sec = sec.padStart(2, '0');
//     // return `${min}:${sec}`; //👈この戻り値を画面に表示させればよい。
//     // のでtimer.textContent = formatTime(seconds);と記述すればよい。
//     //-----↓ 👆を省略系で書く場合-----------------------------------------
//     const min = String(Math.floor(seconds / 60)).padStart(2, '0');
//     const sec = String(seconds % 60).padStart(2, '0');
//     return `${min}:${sec}`; //👈この戻り値を画面に表示させればよい。
// }
// //--◆ ↓ シャッフル中に戻るボタンを押すと裏でタイマーが動き続けてしまう問題を
// // ---shufflePieces()が最後まで実行したか中断か分かる戻り値を返す様にする------------------------------------
// // 455行 if(gameStatus!==statuses.shuffling) return false; //👈false7/22水追加。
//     //583行 ↓ 7/22水追記箇所
//     // return true;
// // 122行目
//     // if (!await shufflePieces()) return;
//     // 👆7/22水シャッフルが中断された時は下の処理が実行されないように追加。

// // -7/22水追記----------------------------------------
// // // resetTimer(); //117行目    
// // 128行目にif (!await shufflePieces()) return;を追加したのでコメントアウト

//---------------------------------------------------------------------------
// //◆次ゲームのクリア判定処理を実装していく 7/22水14時12分～
// checkGameClear関数を作成していく。
// --------------------------------------------------------------------------
// /**●916行目辺りに移植
//  * 
//  */
// function checkGameClear()
// {
//     let matchCount = 0;
//     let currentIndexies = [];
//     let correctIndexies = [];
//     for (let i=0; i<pieces.length; i++){
//         let ci = pieces[i].dataset.correctIndex;
//         currentIndexies[i] = Number(ci).toString();
//         correctIndexies[i] = i.toString();
//     }
//     console.log(currentIndexies);
//     console.log(correctIndexies);
//     for(let j=0; j < pieces.length; j++){
//         if(currentIndexies[j]===correctIndexies[j]){
//             matchCount++;
//         }
//     }
//     if (matchCount >= pieces.length){
//         console.log(`ゲームクリア`);
//     }
//     if (currentIndexies.toString() === correctIndexies.toString())
//     {
// 	alert('ゲームクリア');
//     } else {
// 	alert('ゲーム続行');
//     }
//     console.log(pieces)
//     // ----------------------------------------------------------
//     // ◆7/22水 次、配列を作らずにゲームクリアをする方法を考えてほしいとのこと。
//     // ----------------------------------------------------------    
//     let mcount = 0;
//     for(let k=0; k < pieces.length; k++){
//         if(k!==Number(pieces[k].dataset.correctIndex)){
//             break;
//         }else{
//             mcount++;
//             console.log(mcount);
//             if(mcount >= pieces.length)alert(`クリア`);
//         }
//     }
//     // -----------------------------------------
//     // 7/22水 先生のお手本の書き方
//     // クリア判定のよく使う手法としては先にクリアフラグを立てておくとのこと。
//     //-----------------------------------------
//     let cleard = true;
//     for (let l=0; l < pieces.length; l++){
//         if(l !== +pieces[l].dataset.correctIndex){
//             // 👆+を付けるだけで型変換が出来るとのこと。
//             cleard = false;
//             break;
//         }
//     }
//     if(cleard) console.log(`ゲームクリア！！！`);
//     // -----------------------------------------
//     // 7/22水 先生のお手本の書き方 ２
//     // 更に、every()を使った、よりJavaScriptらしい書き方があるとのこと。
//     //-----------------------------------------
//     const game_cleard = pieces.every(
//         (elem, index)=> index=== +elem.dataset.correctIndex);
//     if(game_cleard) console.log(`くりあ！！！`);
// }
//---------------------------------------------------------------------------
// //◆7/23 木 午後2時間のみここから
// 【ｹﾞｰﾑｸﾘｱ後に行う処理】まとめ
// 済・タイマーを止める
// 済・空白ピースの非表示を解除
// 済・「お手本を開く」「設定に戻る」ボタンの非活性化⇒再活性化
// 済・ゲームステータスをクリア後に更新
// 済・一定の時間待ってからｹﾞｰﾑｸﾘｱ画面に切り替える
// 済  ⇒showClearArea関数の中で「手数・時間」の反映と「エリア」切り替え処理
// --------------------------------------------------------------------------
// ↓ ◆先生の書き方
// checkGameClear(){続きから
//     ～～
// if (cleard){
//     console.log("ゲームクリア");
//     stopTimer();
//     pieces[blankIndex].classList.remove("hidden");
//     //pieces.length -1 でも良いが、そも空白ピースインデックスを作ってあった筈
//     previewBtn.disabled = true;
//     backBtn.disabled = true;
//     gameStatus = statuses.cleared;
//     setTimeout(showClearArea, 1000);
//     }
// }
// function showClearArea(){
//     switchArea(clearArea);
//     //👆クリックされた要素ではなくそのまま対象エリアを渡せばOK
//     finalMoves.textContent = moveCount;
//     finalTime.textContent = formatTime(elapsedSeconds);
// }
//---------------------------------------------------------------------------
// //◆カーソルキーによるピース移動の処理 7/24 金 午前ここから
// ・押されたキーの種類を取得(e.key)
// ・空白ピースの位置（blankIndex）から行インデックスと列インデックスを取得
// ・キーが上だったら空白ピースの行インデックスを基に下のピースを特定する
// ・キーが下だったら空白ピースの行インデックスを基に上のピースを特定する
// ・キーが左だったら空白ピースの列インデックスを基に右のピースを特定する
// ・キーが右だったら空白ピースの列インデックスを基に左のピースを特定する
// ・特定したピースが存在する場合
//      ⇒・特定したピースの行列インデックスからピース管理配列のインデックスを
//          求め、そのピースを移動する。
// ◆４：[1][1]に空白ピースがある場合
// 列_0__1___2__行
// 0|０　１　２　↓：行[1]列[0]
//  |　　↓
// 1|３⇒➃⇐５　
//  |　　↑
// 2|６　７　８
// --------------------------------------------------------------------------
window.addEventListener('keydown', handleKeyDown);
function handleKeyDown(e){
    console.log(`${e}キーが押されました。`)
    console.log(`${e.key}キーが押されました。`)
    // ex:ArrowUpキーが押されました。
    if (gameStatus !== statuses.playing || isShowingPreview) return;
    if (e.repeat) return;
    // 早期リターン(ガード節)でｼｬｯﾌﾙ中と長押し操作を回避。
    e.preventDefault();

    let targetPiecePointer;
    if(e.key==="ArrowUp"){
        const wantMovePiece = (blankIndex +gridSize);
        targetPiecePointer = pieces[wantMovePiece];
        console.log(`wantMovePiece${targetPiecePointer}`)
        tryMovePiece(targetPiecePointer);
    }
    else if(e.key==="ArrowDown"){
        const wantMovePiece = (blankIndex -gridSize);
        targetPiecePointer = pieces[wantMovePiece];
        console.log(`wantMovePiece${targetPiecePointer}`)
        tryMovePiece(targetPiecePointer);
    }
    else if(e.key==="ArrowLeft"){
        const wantMovePiece = (blankIndex +1);
        targetPiecePointer = pieces[wantMovePiece];
        console.log(`wantMovePiece${targetPiecePointer}`)
        tryMovePiece(targetPiecePointer);
    }
    else if(e.key==="ArrowRight"){
        const wantMovePiece = (blankIndex -1);
        targetPiecePointer = pieces[wantMovePiece];
        console.log(`wantMovePiece${targetPiecePointer}`)
        tryMovePiece(targetPiecePointer);
    }else{
        return;
        // 矢印以外のキーが押されたら呼び出し元に戻る。
    }
    //◆ピース事態の文字列番号、ピース管理配列番号インデックス、ピースli要素ポインタ
    //  この3つが区別出来ていないまま、引数名を書いてしまった所があるのが問題。
    //  きちんと整理して、引数名を変えて解りやすくしたい。
    //◆ピースの移動はできたが、シャッフル中の移動を禁止したい。
    // 　⇒gamestatusのifで囲むか？
    //◆そういえばチャタリング処理必要ないのはなぜ？⇒ブラウザ、ハードウェアが吸収済
    // 　⇒e.repeat：長押しをreturnするだけでＯＫ
    // ◆
}
//---------------------------------------------------------------------------
// //◆7/28 火 午前ここから
// ↓ キーボード移動処理先生のお手本
// --------------------------------------------------------------------------

// function handleWindowKeyDown(e){
//     // e.preventDefault();
//     // 👆この位置にスクロール防止をpreventDefaultを入れてしまうと他の操作も
//     //   できなくなってしまうので注意。なのでif文の中※条件付きでブロックする
//     const blankRow = Math.floor
//     const blankCol =
//     let targetRow = blankRow;
//     let targetCol = blankCol;

//     switch (e.key){
//         // ﾀｰｹﾞｯﾄであるのは動かしたいピースでなく空白ピースなのを忘れずに
//         case 'ArrowUp':
//             targetRow++;
//             break;
//         case 'ArrowDown':
//             targetRow--;
//             break;
//         case 'ArrowLeft':
//             targetCol++;
//             break;
//         case 'ArrowRight':
//             targetCol--;
//             break;
//         default:
//             return;
//             // 他のキーを押された時、例外処理を用意する。
//     }
//     if (targetRow>=0 && targetRow<gridSize &&
//          targetCol>=0 && targetCol<gridSize)
//         {
//         const targetIndex = targetRow*gridSize + targetCol;
//         tryMovePiece(pieces[targetIndex]);
//         e.preventDefault();
//     }
//         // 動かしたいピースが移動可能かフィルターしてtrueなら
//         // movePiece(targetIndex);
//         // すでに用意していたmovePiece関数に渡せばピースは動かせる。
//         // ◆⇒しかし、これでは完成イベントや手数がカウントされない。
//         // 　⇒なぜか？⇒ゲーム中のピースの移動処理はtryMovePiece()で管理していた為
//         // ◆⇒しかし関数が変わると注意。引数の渡し方が異なるため。
//         //   ⇒tryMovePiece()には対象HTML要素へのポインタを渡す設計※Element自体を渡す

//         // ◆他問題：お手本中にピース移動が出来てしまう。
//         //   ⇒お手本状態を管理する変数 isShowingPreviewの状態がtrueならreturnする。
//         //     if (gameStatus !== statuses.playing || !isShowingPreview) return;
//         //     👆をtryMovePiece関数内頭に追加する。
//         // ◆キーボード操作すると、画面がスクロールされてしまう。
//         // if()に{ e.preventDefault();}を追加する。
// }
//---------------------------------------------------------------------------
// //◆7/28 火 次の内容
// ローカル画像でパズルができるようにする。
// 今までの内容とだいぶ違って難しいとのこと。
// ファイルピッカーなどを使うとのこと。ファイルピッカーとは？
// --------------------------------------------------------------------------
// ◆まず画像ファイル選択イベントのイベントリスナーへの登録を行う。
// ファイルピッカーはHTMLの
//  <input type="file" name="image-file" id="image-file"
                //  accept="image/*">
                //  <!-- input要素がtypeで選択した値によって変わるのすっかり忘れて
                //   しまっていた、、、。そもそもinput要素についての知識があやふやだ。
                //   input要素と選択できるtypeについて詳しく解説してほしい。 -->
                // <!-- accept属性とは？マイム？とはで
                //  ユーザーに選択して欲しいファイルの分類を記述？
                //  /の後ろに画像のさらに種類、拡張子を指定することも出来る -->
                //   <label for="image-file" id="image-file-lbl">
                //     <!-- labelのidがforと異なっているのはどこかで使っているのだろうか。
                //      デフォルトの部品は非表示にしてラベルだけ表示にしているとのこと。 -->
                //     ローカルの画像ファイル<br>
                //     （クリックして選択 または ドラッグ＆ドロップ）
                // </label>
// に記述されているので id image-fileをイベントリスナーにしていく、とのこと。
// 7/28火 画像ファイル選択イベントのイベントリスナーへの登録
imageFile.addEventListener('change', handleFileSelect);
// 👆新しいイベントへの引数？'change'イベント。フォームなどで使うとのこと。

/**
 * ファイルピッカーで画像が選択された時の処理
 * @param {*Event} e 👈入力値変更イベント…とは？
 */
function handleFileSelect(e){
    console.log('ファイルが選択された。');
    console.log(imageFile);
    // 👆ファイルピッカーをそのままログに出してみるとのこと。
    // 画像ファイル自体がファイルピッカーとは？？
    // ↓●実行結果
    // ファイルが選択された。
    // script.js:2740 <input type=​"file" name=​"image-file" id=​"image-file"
    //  accept=​"image/​*">
    console.log(imageFile.files);
    // .filesでファイルピッカーの持つ情報にアクセスすることが出来るとのこと。
    //     FileList {0: File, length: 1}
    // 👆JSでファイルを管理するファイルオブジェクトの形でまず表示される。
    // 0: File {name: 'dog.jpg', lastModified: 1780551204668,
    // 👆0は配列のインデックス。
    //  lastModifiedDate: Thu Jun 04 2026 14:33:24 GMT+0900 (日本標準時),
    //  webkitRelativePath: '', size: 544392, …}
    // length:  1
    // [[Prototype]]:  FileList
    const file = imageFile.files[0];
    console.log(`ファイル名:${file.name}`);
    console.log(`ファイルサイズ:${file.size}`);
    console.log(`MIMEタイプ:${file.type}`);
    // 👆あれ？typeが上のlogには無い？そもそもMIMEオブジェクトって何だっけ？
    console.log(`更新日時:${file.lastModifiedDate}`);
    // ファイル名:dog.jpg
    // script.js:2759 ファイルサイズ:544392
    // script.js:2760 MIMEタイプ:image/jpeg
    // script.js:2762 更新日時:Thu Jun 04 2026 14:33:24 GMT+0900 (日本標準時)

    // ◆次：選択されたファイルを[画像選択]プルダウンへの追加処理を記述
    // 　⇒ほかでもプルダウンへの追加を行うことがあるので、関数化する。
    addToImageSelect(file);
}
// ↓関数定義※後で関数エリアへ移動させる。
/**
 * 指定されたファイル情報をプルダウンに追加する処理
 * @param {File} file 👈引数追加対象のファイル
 */
function addToImageSelect(file){
    // 指定されたファイルのMIMEタイプが画像ファイル(image/~))
    // 以外の時は処理を終了。
    // MIMEタイプは文字列で、文字列一致を調べる方法があるとのこと
    if(!file.type.startsWith("image/")){
        console.log(`データタイプが画像と違います。`)
        return;
    }
    // ◆先生の別解：正規表現を使う方法書き写し途中
    //if (file.type.search(/^image))



    console.log(`retrunされていたらこれは表示されない。`)
                // ※参考：HTMLの記述
                //     <label for="image-select">画像の選択</label>
                // <select name="image-select" id="image-select">
                //     <!-- なぜlbelとの紐づけでlabel側はidでなくてforと、
                //      言葉が異なっているのだっけ？nameはサーバにデータ送信
                //      時の辞書のキー？にみたいになっているのだっけ？ -->
                //     <option value="images/dog.jpg">犬</option>
                //     <!-- optionタグは初めて見たな、詳しく解説して欲しい。
                //      valudeのファイルパスは同じにならないとダメとのこと。 -->
                // </select>
// 👆プルダウンに追加するのはDOM操作なので、
// これまでやった方法である程度対応できるとのこと。
// プルダウン＝select要素とoption要素の組み合わせとのこと。
// ◆やる必要があること
// ●新しい<option>要素を生成。
// ●<option>要素のテキストに対象ファイルの名前を設定。
// ●<select>要素に<option>要素を追加。
const option = document.createElement('option');
// .createElement("")で作成した要素は戻り値がで受け取らないと、
// そのあと使用できない。
option.textContent = file.name;
// option.setAttribute("selected", "");
// 👆setAttribute(name, value)は引数どちらもstr=""で囲う。
//   追加する属性が論理属性(true,false)の時はvalueは空か"name"と繰り返す。
// ↓◆先生の書き方。optionにもともとselected属性を持っているのでこれでＯＫとのこと
option.selected = true;
// imageSelect.appendChild(option);
// 👇appendChild()では最後に追加されてしまうので、先頭に追加する書き方
// insertBefore(newNode, referenceNode)とのことです。
// そもそもノードとはHTML要素と同義みたいな意味？違いは？
imageSelect.insertBefore(option, imageSelect.firstElementChild);
// firstChild：一番最初の子要素が持っているプロパティ。
// firstElementChild:HTML要素だけに限定して数える※タブなどがカウントされない

//-----------------------------------------7/28 火 午後ここから
// セキュリティ上の観点から(クロスサイトスクリプティングなどJSはセキュリティリスク)
// があるので、ストレージ内のファイル自体の情報を扱うには制限があるとのこと。
// URLオブジェクトとしてJS内でURLは扱われる。
// ストレージ内にのファイル自体の情報を扱う方法、URLを追加する方法はいくつかあるが、
// 今回は URL.createObjectURL(file);を使うとのこと。
// 選択されたファイルのURLをJSで追加する。
option.value = 'value1';
// これで👆F12でvalue属性に value1が追加されたのが分かったので、value1の値を
// 生成されるURLにしてやれば良いとのこと。
const url = URL.createObjectURL(file);
option.value = url;
// <option value=
// "blob:http://127.0.0.1:5500/960d3e9b-59cd-41d0-b0a0-9d008122f597">
// IMG20251130093645ハオルチア桜水晶.jpg</option>
// 👆この様なURLが生成される。blobからのURLをブラウザに貼り付けると画像が見れる。
// ◆先生の説明：
// GoLiveでHTMLを見るときはVS上で簡易的だが実際のサーバが立ち上がっている。
// その時のURLはhttp://127.0.0.1:5500/puzzle/puzzle.htmlのローカルURL
// デフォルトの犬画像は http://127.0.0.1:5500/puzzle/images/dog.jpg
// それで、今回の blob:から始まるURLは👆の普通のURLとは違うルールでつけられている
// ファイルピッカーで選択した画像ファイルは、サーバにアップロードされるわけでなく、
// あくまでローカルPCのメモリ上に存在している。
// blob:の後ろはローカル上のPCのメモリの番地=画像がある場所を無理やりURL化したもの。
// ブラウザは blob: という記述を見ると同じローカルPC上にファイルを探しに行く仕様。
// :5500/960d3e9b-59cd-41d0-b0a0-9d008122f597"👈後ろの英数字は一意に特定する
// 為のランダムに生成される識別子。仮に同じ画像を再度選択しても生成されるIDは異なる。
// ⇒つまりURL.createObjectURL()を実行する度に新たにメモリ上にファイルオブジェクトが
// 生成されて、それをもとに新たに識別子を付けるので、同じ画像でも異なる。
// UUID（Universally Unique Identifier：汎用一意識別子）と呼ぶ。
// 生成されるURLは一時的なものなので、ページが更新されるとメモリ領域も開放され、
// 再確保されるので、そのURLで画像にアクセスできなくなる。
// ◆次：お手本にも選んだ画像が表示されるようにすること。
// handleStartBtnClick内のinitPuzzle();の後に追加する。
// originalPreview.style.backgroundImage = `url(${imgUrl})`;
// CSSの世界では、背景画像を指定するときに background-image: url("画像のパス"); というルール（文法）
console.log(`imageSelect:${imageSelect}`);
/*◆補足：
砂場（ブラウザ）の中にいるJSは、外の世界（ローカルPC）のファイルを
直接見ることができません。 しかしユーザーが「ファイルピッカー」で画像を選んだ瞬間、
OSが**「この画像データのバイナリ（0と1の塊）だけは、
特別に砂場の中にコピー（または参照の許可）をしてあげるよ」**と
ブラウザのメモリ上にデータを配置してくれます。
このバイナリデータの塊を、IT用語で BLOB（Binary Large Object） と呼びます。
そして URL.createObjectURL(file) は、メモリ上に配置された
その BLOB データのアドレス（ポインタ）に対して、
blob:http://127.0.0.1:5500/960d... という**「一時的な仮想URL（文字列）」を
発行するシステムコール**なのです。
C言語で例えるなら、**「メモリ上に確保した画像データへのポインタ void* を
、HTML（<img> タグ）が読み取れるように char*（文字列のURL形式）に
キャストしてあげた」**状態です。
*/
}
// -----------------------------------------
// ◆次：ドラッグアンドドロップによる画像ファイル追加を可能にする
// -----------------------------------------
// ●まず、ドラッグアンドドロップ操作用のイベントを4つ登録する。
imageFileLbl.addEventListener('dragenter', handleDragEnter);
// ↑要素内にドラッグ中のカーソルが入った時。
imageFileLbl.addEventListener('dragleave', handleDragLeave);
// 要素内からドラッグ中のカーソルが出た時
imageFileLbl.addEventListener('dragover', handleDragOver);
// 要素内にドラッグ中のカーソルが移動した時
imageFileLbl.addEventListener('drop', handleDrop);
// 要素内にドロップされた時

// ●次のこの4つのイベントに対応するhandler関数を4つ作っていく。
// ◆次：ファイルピッカーから画像ファイルデータを引き渡す時とは、
// 　ドラッグアンドドロップでデータを引き渡す時はまた別の記述の仕方が必要とのこと
// 　ファイルピッカーが選ばれた時と違い、eにはドラッグイベント自体が入ってしまう。
// 　⇒ドラッグイベントの dataTransferオブジェクトのアトリビュートを見るとのこと。
// handleDrop()内：
//     const file = e.dataTransfer.files[0];
//     console.log(`file:${file}`);
//     console.log(`e.dataTransfer.files:${e.dataTransfer.files}`)
// ●実行結果：
// file:[object File]　👈ファイル
// script.js:2941 e.dataTransfer.files:[object FileList]
// script.js:2892 dragenterが起きた[object DragEvent]
// 20script.js:2928 dragoverが起きた[object DragEvent]
// script.js:2936 dropが起きた[object DragEvent]
// script.js:2940 file:undefined　👈テキスト
// script.js:2941 e.dataTransfer.files:[object FileList]
// ドロップされるものはファイルに限らないので、それを考慮した例外処理を書いておく。
//◆2871行目あたり追加：
//  function addToImageSelect(file){
//     // 指定されたファイルのMIMEタイプが画像ファイル(image/~))
//     // 以外の時は処理を終了。
//     // MIMEタイプは文字列で、文字列一致を調べる方法があるとのこと
//     if(!file.type.startsWith("image/")){
//         console.log(`データタイプが画像と違います。`)
//         return;
//     }
//     console.log(`retrunされていたらこれは表示されない。`)
/**
 * ファイル選択要素内にドラッグが入った時の処理
 * @param {Event} e dragenterイベント
 */
function handleDragEnter(e){
    console.log(`dragenterが起きた${e}`)
    // ●やることドロップ箇所の背景色を変える。
    // ◆参考：👇CSSの記述。:hoverは疑似クラスがあるが、
    // 　ドラッキングは疑似クラスは無いので、クラスを動的に設定する。
    /* ドラッグ＆ドロップゾーンのホバー時、ドラッグ中の設定 */
    // #image-file-lbl:hover,
    // #image-file-lbl.dragging {
    //     background-color: #e0e7ff;
    // }
    /* JavaScriptで、動的にクラス.draggingを生成する様に記述するとのこと。
    画像ファイルを上にドラッグした時はhoverではないとのこと。 */
    // ◆参考：HTMLの記述
    //  <label for="image-file" id="image-file-lbl">
    //                 <!-- labelのidがforと異なっているのはどこかで使っているのだろうか。
    //                  デフォルトの部品は非表示にしてラベルだけ表示にしているとのこと。 -->
    //                 ローカルの画像ファイル<br>
    //                 （クリックして選択 または ドラッグ＆ドロップ）
    //             </label>
    imageFileLbl.classList.add('dragging');
}
/**
 * ファイル選択要素内からドラッグが出た時の処理
 * @param {Event} e drageleaveイベント
 */
function handleDragLeave(e){
    console.log(`drageleaveが起きた${e}`)
    // ●やることドロップ箇所背景色をもとに戻す。
    imageFileLbl.classList.remove('dragging');
}
/**
 * ファイル選択要素内でドラッグが✖移動した〇載っている間中ずっとの時処理
 * @param {Event} e dragoverイベント
 */
function handleDragOver(e){
    e.preventDefault();
    // ↑DragOverのデフォルトイベントをキャンセルするとDropが発生する。なぜ？
    console.log(`dragoverが起きた${e}`)
}
/**
 * ファイル選択要素内にドロップされた時の処理
 * @param {Event} e dropイベント
 */
function handleDrop(e){ 
    e.preventDefault();
    console.log(`dropが起きた${e}`)
    // ●画像がドロップされた時も色が変わる様にする
    imageFileLbl.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    console.log(`file:${file}`);
    console.log(`e.dataTransfer.files:${e.dataTransfer.files}`);
    // ファイルだった場合のみ addToImageSelct()に引き渡す。
    // ●ただこれでは画像ファイル以外も選べてしまうので、それを除外したい。
    // 　ファイルピッカーの場合はMIMEタイプで accept="images/*"の様に制限してる
    //  ⇒addToImageSelect()内に弾く処理を記述するとのこと。
    if (file !== undefined){
        addToImageSelect(file);
    }
}
// 👇console.logだけ記述のコンソールの様子。
// dragenterが起きた[object DragEvent]
// 16script.js:2902 dragoverが起きた[object DragEvent]
// script.js:2895 drageleaveが起きた[object DragEvent]
// ◆ファイルピッカーを開いて、そこからドラッグすると、色が変わらないとのこと。
// 　ログには流れるが、画面描画停止しているのではとのこと。
