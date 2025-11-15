class CustFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "text") {
      this.render();
    }
  }

  render() {
    const text =
      this.getAttribute("text") || "naufaldzaki with Asah by Dicoding 2025";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 75px;
          align-content: center;
          justify-content: center;
          background-color: rgb(230, 230, 230);
          border-top: solid 1px #000000;
          text-align: center;
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        p {
          margin: 0;
          line-height: 75px;
          color: #000;
        }

        @media (max-width: 600px) {
          :host {
            height: auto;
            padding: 0.5rem;
          }
          p {
            line-height: normal;
            padding: 0.5rem 0;
          }
        }
      </style>

      <p>${text}</p>
    `;
  }
}

customElements.define("cust-footer", CustFooter);
