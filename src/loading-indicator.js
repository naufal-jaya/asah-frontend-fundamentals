class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "spinner");

    const style = document.createElement("style");
    style.textContent = `
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #d3d3d3;
        border-top-color: #4a90e2;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: auto;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}

customElements.define("loading-indicator", LoadingIndicator);
