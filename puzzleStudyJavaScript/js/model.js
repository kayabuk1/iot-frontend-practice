// console.log("model.js");
// ●まずは３＊３のパズルのつもりで作っていく。
// ●script.jsファイルと同じようにグローバル変数を宣言していく。
// ↓1辺の分割数
let gridSize = 3;
// ↓ピース並び順管理配列※ここでは実験なので、直接値書き込み
let pieces = ['１','２','３','４','５','６','７','８','　'];
// let pieces = ['　','２','３','４','５','６','７','８','９'];
// let pieces = ['１','２','３','４','　','６','７','８','９'];
// ↓空白ピース位置記憶用変数
let blankIndex = 8;

// ↑これでメインjsファイルと同じような条件を書けた。
/**
 * ピース管理配列内のピースを１辺の分割数に応じて、
 * ２次元でコンソールに出力する処理
 */
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
/*
●HTML<scriptのsorceにこのファイルを追加する。
 ※コンソールで動けばよいので type="module"は書かない
     <script type="module" src="js/script.js"></script>
12行目    ●<script src="js/model.js"></script>
●まずは３＊３のパズルのつもりで作っていく。

次●現在「空白ピース」が位置しているインデックス（blankIndex）を基準に、
    その上下左右に隣接しているピースのインデックスを計算して配列で返す
     getMovableIndices() 関数を作成してください。
*/

// ↓空白を探してから求めなくて良いとのこと。なので没。
function getMovableIndices_test()
{   
    let blanekNeigbers = [];
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
                    blanekNeigbers.push(blankIndex-1);
                    console.log([blankIndex-1]);
                }
                if(blankIndex % gridSize != (gridSize-1)){
                    blanekNeigbers.push(blankIndex+1);
                    console.log([blankIndex+1]);
                }
                if(0 <= (blankIndex-gridSize)){
                    blanekNeigbers.push(blankIndex-gridSize);
                    console.log([blankIndex-gridSize]);
                }
                if((gridSize**2 - gridSize) > blankIndex){
                    blanekNeigbers.push(blankIndex+gridSize);
                    console.log([blankIndex+gridSize]);
                }
            }
        }
    }
    return blanekNeigbers;
}
// ↓グローバル変数blankIndexを元に出力が変わる様にとのことなので変更。
/**
 * 移動可能なピース（空白ﾋﾟｰｽと隣接するﾋﾟｰｽ）の位置を配列で返す処理
 * @returns {Array<number>}移動可能なピースの位置index配列
 */ 
function getMovableIndices()
{   
    let blanekNeigbers = [];

    if(blankIndex % gridSize != 0){
        blanekNeigbers.push(blankIndex-1);
        console.log([blankIndex-1]);
    }
    if(blankIndex % gridSize != (gridSize-1)){
        blanekNeigbers.push(blankIndex+1);
        console.log([blankIndex+1]);
    }
    if(0 <= (blankIndex-gridSize)){
        blanekNeigbers.push(blankIndex-gridSize);
        console.log([blankIndex-gridSize]);
    }
    if((gridSize**2 - gridSize) > blankIndex){
        blanekNeigbers.push(blankIndex+gridSize);
        console.log([blankIndex+gridSize]);
    }
    // blanekNeigbers.unshift(blankIndex);
    return blanekNeigbers
}
/*
済：ユーザーが任意のピースをクリックした際、そのピースが上記で求めた
「移動可能リスト」に含まれているかをチェックし、
●含まれていれば
空白ピースと位置を入れ替える（配列内の要素をスワップする）処理を
記述してください。
*/

/**
 * 引数で指定されたピースが移動可能な場合のみ移動する処理
 * @param {string} piece 移動対処ピースは文字列で渡すこと
 */
// const movalePieceStr = string(blanekNeigbers)
// function tryMovePiece(movalePieceStr){
//     for(let i=0; i < length(movalePieceStr); i++)
//     {
//     const movalePiecesClicker
//     = document.querySelector(`.data-correct-index=${movalePieceStr[i]}`);
//     }
// }
const movalePieceStr = string(blanekNeigbers)
li.dataCorrectIndex.addEventListener('click' ,tryMovePiece);
function tryMovePiece(movalePieceStr){
    if (li.dataCorrectIndex === movalePieceStr) {
        // ↑クリックされたのが動かせる配列リストindexと一致するならと書きたいのだけれど、、、

        // ↑クリックされたピースと空白の位置を入れ替える
        blankIndex,movalePieceStr[動かせる配列index] = movalePieceStr[動かせる配列index],blankIndex;        
        // ↑blankとの配列番号を入れ替える。
    }
}