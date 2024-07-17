const SUPABASE_URL = "https://xcfnauotdoyxwufzdvua.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZm5hdW90ZG95eHd1ZnpkdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTMzMzAsImV4cCI6MjAzNDkyOTMzMH0.DkdHLt7AXWpr-FCUFgDzJ9mAE2yUjt65pDfEoSLTaMs";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchParqueos() {
  try {
    const { data, error } = await supabase.from("Parqueo").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No data found");
      return;
    }

    console.log("Datos obtenidos de Supabase:", data);

    var othercompaniesli = document.getElementById("parqueos");
    othercompaniesli.innerHTML = "";
    var option = "";

    data.forEach((parqueo) => {
      option = document.createElement("option");
      option.innerHTML = `<option id="parqueoSeleccionado">${parqueo.numParqueo}</option>   `;
      console.log(parqueo.numParqueo);
      othercompaniesli.appendChild(option);
    });

    document.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => {
      element.addEventListener("mouseover", function () {
        const tooltipText = this.getAttribute("title");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);
        tooltip.style.left = this.getBoundingClientRect().left + "px";
        tooltip.style.top =
          this.getBoundingClientRect().top - tooltip.offsetHeight + "px";
      });
      element.addEventListener("mouseout", function () {
        document.querySelector(".tooltip").remove();
      });
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
  }
}

async function handleIngresarClick(event) {
  var e = document.getElementById("parqueos");

  var text = e.options[e.selectedIndex].text;
  console.log(text);
  var encodedText = encodeURIComponent(text);

  // Redirigir a semaforo.html con el parámetro text
  window.location.href = "semaforo.html?parqueo=" + encodedText;
}

document.addEventListener("DOMContentLoaded", function () {
  const ingresarButton = document.getElementById("irSemaforo");

  if (ingresarButton) {
    ingresarButton.addEventListener("click", handleIngresarClick);
  } else {
    console.error('El botón con id "irSemaforo" no fue encontrado.');
  }
  fetchParqueos();
});
