
$(document).ready(initilized);

function initilized() {
  var st = new Sports({
    pre: "#pre",
    next: "#next",
    newReleased: ".new-release",
    navbar: ".navbarContainer",
    footer: ".footer",
  });
  st.renderMenu();
  st.GetSportDataFromServer();
  st.addEventListner();
  st.renderFooter();
}


class Sports {
  constructor(elementConfig) {
    this.SportDataFromServer = this.SportDataFromServer.bind(this);
    this.failSportDataFromServer = this.failSportDataFromServer.bind(this);

    this.paginationIncrement = this.paginationIncrement.bind(this);
    this.paginationDecrement = this.paginationDecrement.bind(this);

    this.addData = this.addData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);


    this.dom = {
      area: {
        newReleased: $(elementConfig.newReleased),
        navbar: $(elementConfig.navbar),
        footer: $(elementConfig.footer),
      },
      button: {
        pre: $(elementConfig.pre),
        next: $(elementConfig.next),
      }
    }
    this.data = null;
    this.sports = [];
    this.page = 1;

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
    if (nav.data.link == "MAP") {
      localStorage.setItem("tickets", JSON.stringify(this.events));
    }
    this.navBar.callbacksChangePages(navbar, nav)
  }
  renderFooter() {
    this.dom.area.footer.empty().append(this.footer.renderFooter());
  }
  addData(data) {
    this.sports.push(new Ticket(data, {
      click: this.handleDetalsClick
    }))
  }
  loadData(sportsData) {
    sportsData.forEach(this.addData)
  }
  renderData() {
    var rendersports = this.sports.map(v => v.homePageRender());
    this.dom.area.newReleased.empty().append(rendersports);
  }
  displayData() {
    this.renderData(this.sports)
  }
  GetSportDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=us&classificationName=sports&sort=random&size=6&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
      dataType: "JSON",
    }).done(this.SportDataFromServer)
      .fail(this.failSportDataFromServer)
  }
  SportDataFromServer(res) {
    var sport = res._embedded.events;
    this.loadData(sport);
    this.displayData();

  }
  failSportDataFromServer(xhr) {
    console.log("something is wrong:", xhr)
  }
  addEventListner() {
    this.dom.button.pre.click(this.paginationDecrement);
    this.dom.button.next.click(this.paginationIncrement);
  }
  paginationIncrement() {
    this.page++;
    this.GetSportDataFromServer();
  }
  paginationDecrement() {
    this.page--;
    if (this.page == 0) {
      this.page = 1;
    }
    this.GetSportDataFromServer();
  }
  handleDetalsClick(sport) {
    self.location = `details.html?ticketId=${sport.data.id}`;
  }
}