import frame from './src/frame.js';

const root = document.querySelector('#root')

const vdom = () =>  ({
    type:'div', attrs:{class:'hello'},props:{count:1, word:'bird'},children:[
        {type:'h3', attrs:{},props:{},children:[{type:'text', text:'hello world'}]},
        {type:'div', attrs:{},props:{},children:[
            {type:'p', attrs:{class:'filler', id: 'a'},props:{},children:[{type:'text', text:'hi from the virtual dom, the count count is {{count}} {{count}}'}]},
            {type:'p', attrs:{class:'filler', id: 'b'},props:{},children:[{type:'text', text:'this is kinda fun eh? also the count is {{count}}'}]},
            {type:'p', attrs:{class:'filler', id: 'a'},props:{},children:[{type:'text', text:'the count is {{count}} and the word is {{word}}'},
                {type:'button',attrs:{id:'add',style:'margin:15px'},props:{},children:[{type:'text', text:'Increase Count'}]}
            ]}
        ]}
    ] 
})

let vdomobj = frame.render(vdom, root)

root.addEventListener("click", e => {
    if(e.target.id==="add"){
    console.log('add 1')
    vdomobj.rerender(newVdom)
    }
});