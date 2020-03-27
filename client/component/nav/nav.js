
class Nav {
  constructor(data, callbacks) {
    this.handlePageChange = this.handlePageChange.bind(this);

    this.data = data;
    this.callbacks = callbacks;
  }

  renderNav() {
    var li = $("<li>", {
      class: "nav-item",
    });
    var a = $("<a>", {
      class: "nav-link", 
      text: (this.data.link).toUpperCase(),
      click: this.handlePageChange,
    });
    li.append(a);
    return li;
  }

  handlePageChange(e) {
    if (e)  e.preventDefault();
    this.callbacks.click(this);
  }
}