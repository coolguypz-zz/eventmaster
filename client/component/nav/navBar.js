
class NavBar {
  constructor(callbacks) {
    this.addToNavbar = this.addToNavbar.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);

    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.failProcessData = this.failProcessData.bind(this);

    this.processHandleInputSearch = this.processHandleInputSearch.bind(this);


    this.navList = [
      {
        link: "HOME",
        href: "index.html"
      },
      {
        link: "Concerts",
        href: "concert.html"
      },
      {
        link: "Sports",
        href: "sports.html"
      },
      {
        link: "Arts & Theater",
        href: "art-Theater.html"
      },
      {
        link: "MUSIC",
        href: "music.html"
      },
      {
        link: "MAP",
        href: "map.html"
      },
    ]

    this.dom = {
    }

    this.callbacks = callbacks;
    this.navBars = [];
  }
  addToNavbar(nav) {
    this.navBars.push(new Nav(nav, {
      click: this.handleChangePage,
    }));
  }
  loadNav() {
    this.navList.forEach(this.addToNavbar);
  }
  renderNavBar() {
    var nav = $("<nav>", {
      class: "nav-page mb-5",
      style: "background-color: #e3f2fd",
    });
    var navBrand = $("<a>", {
      class: "navbar-brand",
      href: "index.html",
    });
    var title = $("<h4>", {
      class: "font-italic",
      text: "EventMaster"
    });
    navBrand.append(title);

    var label = $("<label>", {
      for:"check",
      class: "toggler",
      text: "☰",
    });
    var span = $("<input>", {
      id:"check",
      type: "checkbox",
    })
    var ul = $("<ul>", {
      class: "navbar-nav mr-auto",
    })

    var li = this.navBars.map(v => { return v.renderNav() });

    var form = $("<form>", {
      class: "form-inline my-2 my-lg-0",
    });
    var inputSearch = this.dom.inputSearch = $("<input>", {
      class: "form-control mr-sm-2 searchInput", type: "search", 
    });
    var sucessButton = this.dom.sucessButton = $("<button>", {
      class: "btn btn-outline-success my-2 my-sm-0", type: "button",
      text: "submit",
      click: this.handleInputSearch
    })
    form.append(inputSearch, sucessButton);

    ul.append(li);

    nav.append(navBrand, label,span, ul, form)

    return nav;
  }
  handleChangePage(nav) {
    this.callbacks.click(this, nav);
  }
  callbacksChangePages(navbar, nav) {
    self.location = nav.data.href;
  }
  handleInputSearch(navBar) {
    console.log("navBar: ", navBar);
    console.log(this.dom.inputSearch.val());
    this.inputVal = this.dom.inputSearch.val()
    $.ajax({
      method: "GET",
      url: `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${this.inputVal}&apikey=C0p1JrHhaLuA2ean7zga5dZO32rQlNce`,
      dataType: "json",
    }).done(this.processHandleInputSearch)
      .fail(this.failProcessData);
  }
  processHandleInputSearch(res) {
    // console.log("navBar - data: ", res._links.self);
    // var selfLinks = res._links.self
    // self.location = `www.google.com?search=${this.inputVal}`;
  }
  handleNavBarSearch(e) {
    if (e) e.preventDefault();
    var searchInput = this.navBar.dom.searchInput.val();
    console.log("searchInput: ", searchInput);
  }
  failProcessData(xhr, status, err) {
    console.log("object:", xhr, status, err)
  }
}
