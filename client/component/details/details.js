

$(document).ready(initilized);

function initilized() {
  var dl = new Details({
    details: ".details",
    navbar: ".navbarContainer",
    map: "#map",
    select: ".select",
    modelPage: ".modelPage",
    footer:".footer",
  })
  dl.renderMenu();
  dl.getData();
  dl.checkIfHasCart();
  dl.renderFooter();
}


class Details {
  constructor(elementConfig) {

    this.processDetailFromServer = this.processDetailFromServer.bind(this);
    this.failProcessDetailFromServer = this.failProcessDetailFromServer.bind(this);

    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleBounce = this.toggleBounce.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleOpenCart = this.handleOpenCart.bind(this);

    this.dom = {
      input: {
        select: null,
        qtyInput: null,
        button: null,
      },
      area: {
        details: $(elementConfig.details),
        navbar: $(elementConfig.navbar),
        map: $(elementConfig.map),
        select: $(elementConfig.select),
        modelPage: $(elementConfig.modelPage),
        footer:$(elementConfig.footer),
      }
    }
    this.data = {};
    this.cart = [];
    this.cartId = null;
    this.qty = 1,
      this.marker = null;
    this.navBar = new NavBar({
      click: this.handlePageChange,
    })
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
  handleAddToCart() {
    var selectVal = Number(this.dom.input.select.val());
    var qty = Number(this.dom.input.qtyInput.val());
    var item = {
      item: this.data,
      price: selectVal,
      qty: qty,
    }

    ifExist(this.cart, item, qty);
    localStorage.setItem("shoppingcart", JSON.stringify(this.cart));
    this.model = new Model({
      close: this.handleClose,
      open: this.handleOpenCart
    });
    if (qty == 0) {
      this.dom.area.modelPage.empty().append(this.model.renderError());

    } else {
      this.dom.area.modelPage.empty().append(this.model.getData());
    }
    this.dom.input.button.addClass("button-disable");
    this.dom.input.select.addClass("button-disable");
    this.dom.input.qtyInput.addClass("button-disable");
  }
  handleClose(model) {
    model.dom.model.remove();
    this.dom.input.button.removeClass("button-disable");
    this.dom.input.select.removeClass("button-disable");
    this.dom.input.qtyInput.removeClass("button-disable");
  }

  getData() {
    var url_string = window.location.href
    var url = new URL(url_string);
    this.data = url.searchParams.get("ticketId");
    console.log(this.data);
    this.getDetailFromServer();
    return this.data;
  }
  renderDetails() {

    var row = $("<row>", {
      class: "row",
    })

    var leftDiv = $("<div>", {
      class: "col-7",
    })
    var name = $("<div>", {
      class: "col-12 mb-2 h5",
      text: `${this.data._embedded.venues[0].name}`,
    })
    var address = $("<div>", {
      class: "col-12 mb-2 h6",
      text: `Event Address :`,
    })
    var addDiv = $("<div>", {
      class: "col-12 mb-2",
    })
    var street = $("<div>", {
      class: "col-12",
      text: this.data._embedded.venues[0].address.line1,
    })
    var city = $("<div>", {
      class: "col-12",
      text: this.data._embedded.venues[0].city.name
    })
    var state = $("<div>", {
      class: "col-12",
      text: `${this.data._embedded.venues[0].state == undefined ? "" : this.data._embedded.venues[0].state.name} , ${this.data._embedded.venues[0].country.name}`
    })
    addDiv.append(street, city, state);

    var note = $("<div>", {
      class: "col-12 mb-1",
      text: this.data.pleaseNote
    })

    var ticketLimit = $('<div>', {
      class: "col-12 text-warning",
      text: this.data.ticketLimit ? this.data.ticketLimit.info : " ",
    })

    var selectDiv = $("<div>", {
      class: "col-12"
    })

    var icart = $("<i>", {
      class: "fas fa-shopping-cart mr-2",
    })

    var button = this.dom.input.button = $("<div>", {
      class: "cartButton",
      text: "Add To Cart",
      click: this.handleAddToCart
    })

    var select = this.dom.input.select = $("<select>", {
      class: "select"
    });

    button.prepend(icart);

    if (this.price) {
      var minPrice = this.price.map(v => {
        var option = $("<option>", {
          html: ` ${v.type} &nbsp;&nbsp;  $ ${v.min}`,
          value: v.min
        });
        return option;
      })
      var maxPrice = this.price.map(v => {
        var option = $("<option>", {
          html: ` ${v.type} &nbsp;&nbsp;  $ ${v.max}`,
          value: v.max
        });
        return option;
      })
    } else {
      button.addClass("button-disable");
    }

    var firstoption = $("<option>", {
      text: ` select your option `,
    }).attr('disabled', 'disabled')

    select.append(firstoption, minPrice, maxPrice);

    var qtyInput = this.dom.input.qtyInput = $("<input>", {
      type: "number",
      placeholder: this.qty,
      value: this.qty,
      class: "no-spinners",
    })

    selectDiv.append(select, qtyInput, button);

    leftDiv.append(name, address, addDiv, note, ticketLimit, selectDiv);

    var imageRatio = this.data.images.map((v, i) => v.width == 2048);
    var index = imageRatio.indexOf(true);

    var rightDiv = $("<div>", {
      class: "col-5 rightDiv",
      style: `background-image: url(${this.data.images[index].url}`,
    })

    row.append(leftDiv, rightDiv);
    this.dom.area.details.empty().append(row);
  }
  getDetailFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events/${this.data}.json?apikey=C0p1JrHhaLuA2ean7zga5dZO32rQlNce`,
      method: 'GET',
      dataType: "json",
    }).done(this.processDetailFromServer)
      .fail(this.failProcessDetailFromServer)
  }
  processDetailFromServer(res) {
    console.log("object-res: ", res);
    this.data = res;
    this.price = res.priceRanges;
    this.renderDetails();
    this.getLocationFromGoogleMap();

  }
  failProcessDetailFromServer(xhr) {
    console.log("Get Details is wrong ", xhr);
  }
  getLocationFromGoogleMap() {
    var la = parseFloat(this.data._embedded.venues[0].location.latitude)
    var lo = parseFloat(this.data._embedded.venues[0].location.longitude)
    var location = {
      lat: la,
      lng: lo,
    };

    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(la, lo),
      mapTypeId: 'roadmap'
    };

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      center: location,
      title: `Street ${this.data._embedded.venues[0].address.line1}`,
      draggable: false,
      animation: google.maps.Animation.DROP,
    });
    this.marker.addListener('click', this.toggleBounce);
  }
  toggleBounce() {
    var infoWindow = new google.maps.InfoWindow();

    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
      this.map.setZoom(17);
      var div = `<div class="inforWindow"> 
            <div><h6> ${this.data.name}</h6></div>
            <div>${this.data._embedded.venues[0].city.name} , ${this.data._embedded.venues[0].state.name}</div>
             </div>`;
      infoWindow.setContent(div);
      infoWindow.open(this.map, this.marker);
    }
  }

  checkIfHasCart() {
    this.cartId = localStorage.getItem("shoppingcart");
    if (this.cartId) {
      this.cart = JSON.parse(this.cartId);
    }
  }
  handleOpenCart() {
    self.location = `cart.html?cartNumber=${new Date()}`
  }
}


