export function PromptFile() {
  return <div className="prompt-file">
    <div className="prompt-toolbar"><button type="button">文件(F)</button><button type="button">编辑(E)</button><button type="button">格式(O)</button><button type="button">查看(V)</button><button type="button">帮助(H)</button></div>
    <pre><span>所以我放弃了音乐：唱片商店留下了几条线索。</span>{'\n\n'}<span>题目合约地址：0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</span>{'\n\n'}<span>查看合约、浏览交易记录，再打开专辑看看。</span></pre>
    <div className="prompt-status">题目提示.txt　　　Windows 文本文件</div>
  </div>;
}
