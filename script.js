document.addEventListener("DOMContentLoaded",()=>{
    const container=document.getElementById("container");
    const product_list=document.getElementById("product_list");
    const cart_items=document.getElementById("cart_items");
    const empty_cart=document.getElementById("empty_cart");
    const cart_total=document.getElementById("cart_total");
    const total_price=document.getElementById("total_price");
    const checkout_btn=document.getElementById("checkout_btn");

    const products=[
        {id: 1,name:"Product 1",price:30.00},
        {id: 2,name:"Product 2",price:20.00},
        {id: 3,name:"Product 3",price:10.00},
        {id: 4,name:"Product 4",price:11.999999},
    ]
    const cart=[];

    function save_cart_to_local_storage(){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    
    products.forEach( product =>{
            const product_div=document.createElement('div');
            product_div.classList.add('product');
            product_div.innerHTML=`
            <span>${product.name}-$${product.price.toFixed(2)}</span>
            <button data-id="${product.id}" class="add_btn">ADD</button>
            `;
            product_list.appendChild(product_div)
    })

    function add_to_cart(product){
        cart.push(product);
        save_cart_to_local_storage();
        render_cart();
    }

    function render_cart(){
        cart_items.innerText="";
        let total_cart_price=0;
        if(cart.length>0)
        {
            empty_cart.classList.add('hidden');
            cart_total.classList.remove('hidden');
            cart_items.classList.remove('hidden');
            const freq=new Map();
            cart.forEach(item=>{
                total_cart_price+=item.price;
                if(freq.has(item.id))
                {
                    freq.set(item.id,{ ...item, count: freq.get(item.id).count+1})
                }
                else
                {
                    freq.set(item.id,{ ...item,count:1});
                }
            })

            freq.forEach(product=>{
                const cart_item=document.createElement('div');
                cart_item.classList.add('cart_item');
                cart_item.innerHTML=`
                    ${product.name} - $${product.price.toFixed(2)*product.count} (X${product.count})
                    <button class="remove_btn" data-id="${product.id}">Remove</button>
                `;
                cart_items.appendChild(cart_item);
            })
            total_price.textContent=`$${total_cart_price.toFixed(2)}`;  
        }
        else{
            empty_cart.classList.remove('hidden');
            total_price.textContent = `$0.00`;
            cart_items.classList.add('hidden');
        }
    }

    product_list.addEventListener("click",(dets)=>{
        if(dets.target.tagName==="BUTTON")
        {
            let product_id=parseInt(dets.target.getAttribute('data-id'));
            const product=products.find(p=>p.id===product_id)
            add_to_cart(product);
        }
    })

    checkout_btn.addEventListener("click",()=>{
        cart.length=0;
        total_price.textContent=0;
        save_cart_to_local_storage();
        alert("Checkout successful");
        render_cart();
    })

    cart_items.addEventListener("click",(dets)=>{
        if(dets.target.classList.contains("remove_btn"))
        {
            const product_id=parseInt(dets.target.getAttribute("data-id"));
            const index=cart.findIndex(item => item.id === product_id);
            if(index !== -1)
            {
                cart.splice(index,1);
                save_cart_to_local_storage();
                render_cart();
            }
        }
    })
})