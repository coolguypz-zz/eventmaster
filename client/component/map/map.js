

$(document).ready(initilized);

function initilized() {
  var ml = new SeachEvent({
    navbar: ".navbarContainer",
    nameInput: "#name",
    cityInput: "#city",
    stateInput: "#state",
    submitButton: "#submitButton",
    inforWindow: ".inforWindow",
    map: "#map",
    showMore: "#show-more",
    footer:".footer",
  });
  ml.renderMenu();
  ml.renderFooter();
  ml.renderState();
  ml.getLocation();
  ml.addEventListener();
  ml.getLocationFromGooglemle();
}


class SeachEvent {
  constructor(elementConfig) {

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlefilterAndSort = this.handlefilterAndSort.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.getLocationFromGooglemle = this.getLocationFromGooglemle.bind(this);

    this.succussGetDataFromServer = this.succussGetDataFromServer.bind(this);
    this.failGetDataFromServer = this.failGetDataFromServer.bind(this);

    this.geoSuccess = this.geoSuccess.bind(this);
    this.geoError = this.geoError.bind(this);
    this.codeLatLng = this.codeLatLng.bind(this);

    this.dom = {
      input: {
        nameInput: $(elementConfig.nameInput),
        cityInput: $(elementConfig.cityInput),
        stateInput: $(elementConfig.stateInput),
      },
      area: {
        navbar: $(elementConfig.navbar),
        map: $(elementConfig.map),
        footer: $(elementConfig.footer),
      },
      button: {
        submitButton: $(elementConfig.submitButton),
        showMore: $(elementConfig.showMore),
      },
    };

    this.states = [
      "AK - Alaska",
      "AL - Alabama",
      "AR - Arkansas",
      "AS - American Samoa",
      "AZ - Arizona",
      "CA - California",
      "CO - Colorado",
      "CT - Connecticut",
      "DC - District of Columbia",
      "DE - Delaware",
      "FL - Florida",
      "GA - Georgia",
      "GU - Guam",
      "HI - Hawaii",
      "IA - Iowa",
      "ID - Idaho",
      "IL - Illinois",
      "IN - Indiana",
      "KS - Kansas",
      "KY - Kentucky",
      "LA - Louisiana",
      "MA - Massachusetts",
      "MD - Maryland",
      "ME - Maine",
      "MI - Michigan",
      "MN - Minnesota",
      "MO - Missouri",
      "MS - Mississippi",
      "MT - Montana",
      "NC - North Carolina",
      "ND - North Dakota",
      "NE - Nebraska",
      "NH - New Hampshire",
      "NJ - New Jersey",
      "NM - New Mexico",
      "NV - Nevada",
      "NY - New York",
      "OH - Ohio",
      "OK - Oklahoma",
      "OR - Oregon",
      "PA - Pennsylvania",
      "PR - Puerto Rico",
      "RI - Rhode Island",
      "SC - South Carolina",
      "SD - South Dakota",
      "TN - Tennessee",
      "TX - Texas",
      "UT - Utah",
      "VA - Virginia",
      "VI - Virgin Islands",
      "VT - Vermont",
      "WA - Washington",
      "WI - Wisconsin",
      "WV - West Virginia",
      "WY - Wyoming"
    ];
    this.data = null;
    this.page = 1;
    this.pageSize = 25;
    this.keyword = "";
    this.category = [];
    this.postCode = ""
    this.stateCode = "";
    this.preState = null;

    this.map = null;
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
  renderState() {
    var state = this.states.map(v => {
      var option = $("<option>", {
        text: v,
      })
      return option;
    })
    this.dom.input.stateInput.append(state);
  }
  addEventListener() {
    this.dom.button.submitButton.click(this.handlefilterAndSort);
    this.dom.button.showMore.click(this.handlePagination);
  }
  handlePagination() {
    this.page++;
    if (this.pageSize <= 175) {
      this.pageSize += 25;
    } else {
      alert("there is no more events");
      return;
    }
    this.getDataFromServer();
  }
  handlefilterAndSort() {
    this.postCode = this.dom.input.cityInput.val();
    var state = this.dom.input.stateInput.val();
    this.keyword = this.dom.input.nameInput.val();

    if (state) {
      var [prefix, fullname] = state.split(" - ");
      this.stateCode = prefix;
      if (this.stateCode != this.preState) {
        this.data = null;
        this.events = [];
        this.page = 1;
        this.pageSize = 25;
      }
      this.preState = this.stateCode;
      this.getDataFromServer();
    } else {
      this.getLocation();
    }
  }
  getDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=${this.keyword}&postalCode=${this.postCode}&stateCode=${this.stateCode}&classificationName=${this.category}&sort=random&size=${this.pageSize}&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
    }).done(this.succussGetDataFromServer)
      .fail(this.failGetDataFromServer);
  }
  succussGetDataFromServer(res) {
    if (res._embedded) {
      this.data = res._embedded.events;
      this.getLocationFromGooglemle();
      console.log(this.data);
    } else {
      console.log(res);
      alert("There is no Event avaliable");
    }
  }
  failGetDataFromServer(xhr) {
    console.log("something is wrong : ", xhr);
  }
  getLocationFromGooglemle() {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 38.500000, lng: -98.000000 },
      zoom: 4,
    });

    if (this.data) {
      this.data.forEach(v => {

        var location = {
          lat: parseFloat(v._embedded.venues[0].location.latitude),
          lng: parseFloat(v._embedded.venues[0].location.longitude),
        }

        var marker = new google.maps.Marker({
          position: location,
          draggable: false,
          animation: google.maps.Animation.DROP,
          map: map,
        });
        google.maps.event.addListener(marker, "click", (e)=> {

          var div =  `<a class="inforWindow" href = "details.html?ticketId=${v.id}">
          <div> 
          <div><h6> ${v.name}</h6></div>
          <div>${v._embedded.venues[0].city.name} , ${v._embedded.venues[0].state.name}</div>
           </div>
           </a>`;
         var infoWindow = new google.maps.InfoWindow({
          content:div,
         });
          infoWindow.open(map, marker);
          map.setZoom(11);
          map.setCenter(marker.getPosition());
        });
      })
    }
  }
  handleEventClick() {
    console.log("this is clicked");
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  geoSuccess(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.codeLatLng();
  }
  geoError() {
    console.log("Geocoder failed.");
  }
  codeLatLng() {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(this.lat, this.lng);
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results)
        if (results[1]) {
          //formatted address
          var address = results[0].formatted_address;
          var [streeName, cityName, StateName, countryName] = address.split(", ");
          console.log(streeName);
          console.log(cityName);
          console.log(StateName);
          console.log(countryName);
          var [s, z] = StateName.split(" ");
          this.stateCode = s;
          var value = this.states.filter(v => { return v.includes(this.stateCode) });
          this.dom.input.stateInput.val(value);
          this.getDataFromServer();
        }
      }
    });
  }
}
