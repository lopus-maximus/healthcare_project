let data = [];

function loadHTMLComponent(elementId, filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getUsers() {
  let response = await fetch("demo.json");
  let unfilteredData = await response.json();

  data = unfilteredData.slice(1);

  let tab = "";
  data.forEach((user, index) => {
    tab += `<tr class="bla" id="user-${index}" data-toggle="collapse" data-target="#content-${index}" aria-expanded="true" aria-controls="content-${index}">
      <td class="p-3" width="20%">
      <span
          ><button class="arrow"><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6"></path>
            </button>
          </svg>
      ${user.field_name}
      </td>
      <td>${user.description}</td>
      <td>${user.exp_response_type}</td>
      <td>${user.field_type}</td>
      <td>${user.category}</td>
    </tr>
    <tr class="collapse" id="content-${index}">
      <td colspan="5">
        <div>
          <p><strong>Description:</strong> ${user.description}</p>
          <p><strong>Response Type:</strong> ${user.exp_response_type}</p>
          <p><strong>Field Type:</strong> ${user.field_type}</p>
          <p><strong>Category:</strong> ${user.category}</p>
        </div>
      </td>
    </tr>`;
  });
  document.getElementById("tbody").innerHTML = tab;

  document.querySelectorAll(".bla").forEach((header, index) => {
    header.addEventListener("click", () => {
      const content = document.getElementById(`content-${index}`);
      content.classList.toggle("show");
      const arrow = header.querySelector(".arrow");
      arrow.classList.toggle("rotated");
    });
  });

  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadHTMLComponent("navbar-placeholder", "components/navbar.html")
    .then(() => loadHTMLComponent("sidebar", "components/sidebar.html"))
    .then(() => loadHTMLComponent("content", "components/content.html"))
    .then(async () => {
      await getUsers();

      let btn = document.querySelectorAll("#btn");
      let sidebar = document.querySelector(".sidebar");
      let content = document.querySelector(".content");
      const searchInput = document.querySelector("[data-search]");

      btn.forEach((button) => {
        button.onclick = function () {
          sidebar.classList.toggle("active");
          content.classList.toggle("active");
        };
      });

      searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        data.forEach((user, index) => {
          const isVisible =
            user.field_name.toLowerCase().includes(value) ||
            user.exp_response_type.toLowerCase().includes(value) ||
            user.field_type.toLowerCase().includes(value) ||
            user.category.toLowerCase().includes(value);
          const row = document.getElementById(`user-${index}`);
          row.classList.toggle("hide", !isVisible);
        });
      });
    });
});
