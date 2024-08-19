let data = [];
let currentPage = 1;
const rowsPerPage = 10;
let originalData = [];
let sortCounts = {
  field_name: 0,
  description: 0,
  pi: 0,
  concept_id: 0,
  field_type: 0,
  category: 0,
};
let upArrow = `<svg class="order-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 384 512"><path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`;
let downArrow = `<svg class="order-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 384 512"><path fill="currentColor" d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;
let upDown = upArrow + downArrow;

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
  originalData = [...data];

  displayTable(data, currentPage);
  setupPagination(data);

  return data;
}

function displayTable(data, page) {
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  let tab = "";
  paginatedData.forEach((user, index) => {
    tab += `<tr class="bla" id="user-${index}" data-toggle="collapse" data-target="#content-${index}" aria-expanded="true" aria-controls="content-${index}">
      <td class="p-3" style="width: 15%">
      <span><button class="arrow"><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-down">
            <path d="m6 9 6 6 6-6"></path>
          </svg></button></span>
      ${user.field_name}
      </td>
      <td style="width: 15%">${user.concept_id}</td>
      <td style="width: 30%">${user.description}</td>
      <td style="width: 15%">${user.pi}</td>
      <td style="width: 10%">${user.field_type}</td>
      <td style="width: 15%">${user.category}</td>
    </tr>
    <tr class="collapse" id="content-${index}">
      <td colspan="6">
        <div>
          <p><strong>Concept:</strong> ${user.concept}</p>
          <p><strong>Response Type:</strong> ${user.exp_response_type}</p>
          <p><strong>Concept Label: </strong> ${user.concept_label}</p>
          <p><strong>Study Description:</strong> ${user.study_description}</p>
        </div>
      </td>
    </tr>`;
  });
  document.getElementById("tbody").innerHTML = tab;

  document.querySelectorAll(".bla").forEach((header, index) => {
    header.addEventListener("click", () => {
      const content = document.getElementById(`content-${index}`);
      content.classList.toggle("show");
      header.classList.toggle("border-bottom-0");
      const arrow = header.querySelector(".arrow");
      arrow.classList.toggle("rotated");
    });
  });
}

function setupPagination(data) {
  const pageCount = Math.ceil(data.length / rowsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const maxVisibleButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
  let endPage = Math.min(startPage + maxVisibleButtons - 1, pageCount);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
  }

  const prevButton = document.createElement("button");
  prevButton.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-chevron-left"
>
  <path d="M15 18l-6-6 6-6"></path>
</svg>
Previous
`;
  prevButton.disabled = currentPage === 1;
  prevButton.classList.add("slide");
  prevButton.addEventListener("click", () => {
    currentPage--;
    displayTable(data, currentPage);
    setupPagination(data);
  });
  paginationContainer.appendChild(prevButton);

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.classList.add("page-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayTable(data, currentPage);
      setupPagination(data);
    });
    paginationContainer.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.innerHTML = `Next <svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-chevron-right"
>
  <path d="M9 18l6-6-6-6"></path>
</svg>
`;
  nextButton.disabled = currentPage === pageCount;
  nextButton.classList.add("slide");
  nextButton.addEventListener("click", () => {
    currentPage++;
    displayTable(data, currentPage);
    setupPagination(data);
  });
  paginationContainer.appendChild(nextButton);
}

function setArrowIcons(order, columnId) {
  const columnItems = document.querySelectorAll(".column-sort");
  columnItems.forEach((item) => {
    item.innerHTML = item.textContent.trim();
    const icon = document.createElement("span");
    icon.innerHTML = upDown;
    icon.style.marginLeft = "0.5rem";
    item.appendChild(icon);
  });

  const targetColumn = document.getElementById(columnId);
  targetColumn.innerHTML = targetColumn.textContent.trim();
  const newIcon = document.createElement("span");
  newIcon.style.marginLeft = "0.5rem";

  if (order === 1) {
    newIcon.innerHTML = upArrow;
  } else if (order === 2) {
    newIcon.innerHTML = downArrow;
  } else {
    newIcon.innerHTML = upDown;
  }

  targetColumn.appendChild(newIcon);
}

function sortData(order, columnId) {
  if (order === 1) {
    data.sort((a, b) => {
      const aValue = a[columnId] || "";
      const bValue = b[columnId] || "";
      return aValue.localeCompare(bValue);
    });
  } else if (order === 2) {
    data.sort((a, b) => {
      const aValue = a[columnId] || "";
      const bValue = b[columnId] || "";
      return bValue.localeCompare(aValue);
    });
  } else if (order === 0) {
    data = [...originalData];
  }
  displayTable(data, currentPage);
  setupPagination(data);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadHTMLComponent("navbar-placeholder", "components/navbar.html")
    .then(() => loadHTMLComponent("sidebar", "components/sidebar.html"))
    .then(() => loadHTMLComponent("content", "components/content.html"))
    .then(async () => {
      await getUsers();

      // const email = localStorage.getItem("email");
      // const profile = email.slice(0, 2);
      // document.getElementById("userIcon").innerHTML = profile;
      console.log(localStorage);

      let btn = document.querySelectorAll("#btn");
      let sidebar = document.querySelector(".sidebar");
      let content = document.querySelector(".content");
      const searchInput = document.querySelector("[data-search]");
      const sortColumnItems = document.querySelectorAll(".column-sort");

      btn.forEach((button) => {
        button.onclick = function () {
          sidebar.classList.toggle("active");
          content.classList.toggle("active");
        };
      });

      searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        data = originalData.filter((user) => {
          return (
            (user.field_name &&
              user.field_name.toLowerCase().includes(value)) ||
            (user.description &&
              user.description.toLowerCase().includes(value)) ||
            (user.exp_response_type &&
              user.exp_response_type.toLowerCase().includes(value)) ||
            (user.field_type &&
              user.field_type.toLowerCase().includes(value)) ||
            (user.category && user.category.toLowerCase().includes(value))
          );
        });
        currentPage = 1;
        displayTable(data, currentPage);
        setupPagination(data);
      });

      sortColumnItems.forEach((item) => {
        setArrowIcons(0, item.id);
        item.addEventListener("click", (e) => {
          const columnId = item.id;
          sortCounts[columnId] = (sortCounts[columnId] + 1) % 3;
          sortData(sortCounts[columnId], columnId);
          setArrowIcons(sortCounts[columnId], columnId);
        });
      });
    });
});
