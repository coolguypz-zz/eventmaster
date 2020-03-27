

$(document).ready(initilized);

function initilized() {
  var c = new Cart({
    navbar: ".navbarContainer",
    cart: ".cart",
    footer:".footer",
  });
  c.renderMenu();
  c.getCartData();
  // c.renderFooter();
}

class Cart {
  constructor(elementConfig) {

    this.addCartItem = this.addCartItem.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.dom = {
      area: {
        navbar: $(elementConfig.navbar),
        cart: $(elementConfig.cart),
        footer:$(elementConfig.footer),
      }
    }
    this.cartItems = [];
    this.cart = { items: [] }
    this.navBar = new NavBar({
      click: this.handlePageChange,
    });
    this.footer = new Footer();
  }
  renderMenu() {
    this.navBar.loadNav();
    var menubar = this.navBar.renderNavBar();
    this.dom.area.navbar.empty().append(menubar);
  }
  handlePageChange(navbar, nav) {
    this.navBar.callbacksChangePages(navbar, nav)
  }
  renderFooter() {
    this.dom.area.footer.empty().append(this.footer.renderFooter());
  }
  getCartData() {
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
    this.loadCart(this.cart.items)
    console.log(this.cart);

    return this.cart.items;
  }
  addCartItem(ci) {
    this.cartItems.push(new CartItem(ci, {
      del: this.handleDelete
    }));
    this.displayCart();
  }
  loadCart(cart) {
    cart.forEach(this.addCartItem);
  }
  displayCart() {
    this.renderCartItems(this.cartItems);
  }
  renderCartItems(cs) {

    var cartItem = cs.map(v => v.renderCartItem());

    var total = this.dom.total = $("<div>", {
      class: "row total",
    });
    var offset = $("<div>", {
      class: "col-9 offset-4"
    })
    var totalOrder = $("<div>", {
      class: "totalOrder",
      text: "Total Order : "
    })
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

    this.dom.area.cart.empty().append(cartItem, total);
  }
  handleDelete(row) {
    row.dom.row.remove();
   this.cart.items = this.cart.items.filter(v => { return v.item.id !== row.data.item.id })
    console.log(this.cart.items);
    localStorage.clear();
    localStorage.setItem("shoppingcart",JSON.stringify(this.cart.items));
    this.getCartData(this.cart.items);
  }
}