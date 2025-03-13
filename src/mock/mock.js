import Mock from "mockjs"
var {product} = Mock.mock({
    'product|10':[
        {
            id: '@id',
            img:'@image("200x200", "#50a8e6", "product")',
            name: '@cword(3,6)',
            content: '@csentence(5,10)',
            price: '@float(0,100,2,2)',
            stock: '@integer(100, 500)',
            original: '@float(100,200,2,2)',
            num: '@integer(1, 10)'
        }
    ]
})
Mock.mock('/api/product', 'get', ()=>{
    return{
        code:200,
        data:product
    }
})
