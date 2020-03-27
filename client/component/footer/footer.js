

class Footer {
  constructor() {

  }
  renderFooter() {
    var container = $("<div>", {
      class: "container pt-2",
    });
    var rowAbout = $("<div>", {
      class: "row mb-3"
    });
    var about = $("<div>", {
      class: "col-2",
      text: "About",
    });
    var abouts = $("<div>", {
      class: "col-1",
      text: "|",
    });
    var pn = $("<div>", {
      class: "col-2",
      text: "Privacy Notice",
    });
    var tu = $("<div>", {
      class: "col-2",
      text: "Terms of Use",
    });
    var oc = $("<div>", {
      class: "col-2",
      text: "Our Company",
    });
    var carrer = $("<div>", {
      class: "col-2",
      text: "Carrers",
    });
    rowAbout.append(about,abouts,pn,tu,oc,carrer);

    var rowContact = $("<div>", {
      class: "row mb-3"
    });
    var contact = $("<div>", {
      class: "col-2",
      text: "Contact",
    });
    var contacts = $("<div>", {
      class: "col-1",
      text: "|",
    });
    var cs = $("<div>", {
      class: "col-2",
      text: "Customer Service",
    });
    var email = $("<div>", {
      class: "col-2",
      text: "Email",
    });
    rowContact.append(contact,contacts,cs,email);

    var rowConnect = $("<div>", {
      class: "row mb-3"
    });
    var connect = $("<div>", {
      class: "col-2",
      text: "Connect",
    });
    var connects = $("<div>", {
      class: "col-1",
      text: "|",
    });
    var facebook = $("<div>", {
      class: "col-2",
      text: "Facebook",
    });
    var twitter = $("<div>", {
      class: "col-2",
      text: "Twitter",
    });
    var ig = $("<div>", {
      class: "col-2",
      text: "Instagram",
    });
    var google = $("<div>", {
      class: "col-2",
      text: "Google",
    });
    rowConnect.append(connect,connects,facebook,twitter,ig,google)

    var lastRow = $("<div>", {
      class: "row mb-3 ml-4 last-row text-left"
    })
    var tag = $("<div>", {
      class: "col-12 mt-2 h6 firstchild",
      text: "EVENTMASTER",
    });
    var copyright = $("<div>", {
      class: "col-12 mt-1",
      html: `&copy; copyright ${new Date().getFullYear()} eventmaster.com`,
    });
    lastRow.append(tag,copyright);

    container.append(rowAbout,rowContact,rowConnect,lastRow);

    return container;
  }
}