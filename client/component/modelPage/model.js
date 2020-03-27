
class Model {
  constructor(callbacks) {
    this.handleClose = this.handleClose.bind(this);
    this.handleDirectToCart = this.handleDirectToCart.bind(this);
    this.addCartItem = this.addCartItem.bind(this);
    this.dom = {

    }

    this.data = null;
    this.callbacks = callbacks;
    this.cartItems = [];
    this.cart = { items: [] }
    }
  getData() {
    this.cart.items = JSON.parse(localStorage.getItem("shoppingcart"));

    var sumQty = totalQty(this.cart.items);
    var sumPrice = totalPrice(this.cart.items);

    if(sumQty == 0 || sumPrice == 0){
      if(this.dom.total){
        this.dom.total.remove();
      }
    }

    this.cart.sumQty = sumQty;
    this.cart.sumPrice = sumPrice;
    this.cartItems = [];
    this.loadCart(this.cart.items);
    return this.displayCart();
  }
  addCartItem(ci) {
    this.cartItems.push(new CartDetails(ci, {
      del: this.handleDelete
    }));
  }
  loadCart(cart) {
    cart.forEach(this.addCartItem);
  }
  displayCart() {
    return this.renderModel(this.cartItems);
  }
  renderModel(cs) {
    var modelDiv = this.dom.model = $("<div>", {
      class: "model container",
    });
    var modelHeaer = $("<div>", {
      class: "h5 modelHeaer col-12",
      text: "Cart Item",
    });
    var modelBody = $("<div>", {
      class: "modelBody container",
    });
    var cartItem = cs.map(v => v.renderCartDetails());

    var total = this.dom.total = $("<div>", {
      class: "row total",
    });
    var offset = $("<div>", {
      class: "col-9 offset-3"
    })
    var totalOrder = $("<div>", {
      class: "totalOrder",
      text: "Total Order : "
    }).css({"width":"40%",})
    var totalQty = this.dom.totalQty =  $("<div>", {
      class: "totalOrder",
      text: this.cart.sumQty,
    });
    var totalPrice = this.dom.totalPrice = $("<div>", {
      class: "totalOrder",
      text: `$${this.cart.sumPrice}`,
    })
    offset.append(totalOrder, totalQty, totalPrice);

    total.append(offset);

    modelBody.append(cartItem, total);
        // modelBody.append(total);


    var modelFooter = $("<div>", {
      class: "modelFooter col-12 ",
    });
    var goCart = $("<div>", {
      class: "goCart btn btn-success",
      text: "Go to Cart",
      click: this.handleDirectToCart
    });
    var browse = $("<div>", {
      class: "browse btn btn-warning",
      text: "Close",
      click: this.handleClose
    });

    modelFooter.append(browse, goCart);

    modelDiv.append(modelHeaer, modelBody, modelFooter);
    return modelDiv;
  }

  renderError() {
    var modelDiv = this.dom.model = $("<div>", {
      class: "model row",
    });
    var modelHeaer = $("<div>", {
      class: "h4 modelHeaer col-12 p-2 text-danger",
      text: "WARNING",
    });
    var modelBody = $("<div>", {
      class: "modelBody col-12 h5 p-5 text-center",
      text: "You haven't select your ticket Quantity"
    });
    var modelFooter = $("<div>", {
      class: "modelFooter col-12 ",
    });
    var browse = $("<div>", {
      class: "browse btn btn-warning",
      text: "Close",
      click: this.handleClose,
    });
    modelFooter.append(browse);

    modelDiv.append(modelHeaer, modelBody, modelFooter);

    return modelDiv;
  }

  handleClose(e) {
    if (e) e.preventDefault();
    this.callbacks.close(this);
  }
  handleDirectToCart() {
    this.callbacks.open(this);
  }
}


class CartDetails{
  constructor(data,callbacks){

    this.dom = {

    }
    this.data = data;
    this.callbacks = callbacks;
  }
  renderCartDetails(){
    var row = this.dom.row = $("<div>",{
      class:"row row-border",
    })
    var [hightRatioImg] = this.data.item.images.filter(v => {
      if(v.width == 2048){
        return v.url;
      }
    })
    var imgDiv = $("<div>",{
      class:"col",
    })
    var img = $("<img>",{
      class: "cartImg",
      src:hightRatioImg.url,
    })
    imgDiv.append(img);

    var name = $("<div>",{
      class:"col",
      text:this.data.item.name,
    })

    var eventDate = $("<div>",{
      class:"col",
    })
    var date = $("<div>",{
      class:"col",
      text:this.data.item.dates.start.localDate
    })
    var time = $("<div>",{
      class:"col",
      text:this.data.item.dates.start.localTime
    })
    // eventDate.append(date,time);

    var qty = $("<div>",{
      class:"col-1",
      text:this.data.qty,
    })
    var price = $("<div>",{
      class:"col-2",
      text: `$${this.data.price.toFixed(2)}`
    })
    var buttonDiv = $("<div>",{
      class:"col-2",
    })
    var button = $("<div>",{
      class:"btn btn-danger p-1 delbtn",
      text:"DELETE",
      click:this.handleDelete,
    })
    buttonDiv.append(button);

    row.append(imgDiv,name,qty,price,buttonDiv);

    // row.append(imgDiv,name,eventDate,qty,price,buttonDiv);

    return row;
  }
  handleDelete(e){
    if(e) e.preventDefault();
    this.callbacks.del(this);
  }
}