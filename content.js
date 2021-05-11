console.log("content script started");

function isGradStudent(txt) {
  return txt && txt.match("Student") && txt.match("GRAD");
}

document.body.onload = () => {
  console.log("onload called");
  const rows = document.querySelectorAll(".table_results tr");
  const emails = [];
  for (let i = 0; i < rows.length; i++) {
    if (isGradStudent(rows[i].children[1].innerHTML)) {
      const email = rows[i].children[3].querySelector(".mailto").innerText;
      emails.push(email);
    }
  }

  if (emails.length > 0) {
    // Save emails
    console.log(emails);
    const emailBlob = new Blob([emails.join("\n")], { type: "text/plain" });
    const reader = new FileReader();
    reader.onload = () => {
      console.log("reader result", reader.result);
      const dowloadlink = document.createElement("a");
      dowloadlink.setAttribute("href", reader.result);
      dowloadlink.setAttribute(
        "download",
        "columbia-people-" + new Date().toString() + ".txt"
      );
      dowloadlink.click();
    };
    reader.readAsDataURL(emailBlob);
  }

  // Navigate to next page
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  let currentPage = searchParams.get("page");
  if (!currentPage) {
    currentPage = "0";
  }
  const totalPagesMatch = document
    .querySelector(".results_wrapper .innards")
    .innerText.match(/\d$/);
  const totalPages = parseInt(
    document
      .querySelector(".results_wrapper .innards")
      .innerText.slice(
        totalPagesMatch.index,
        totalPagesMatch.index + totalPagesMatch.length
      )
  );
  if (parseInt(currentPage) + 1 >= totalPages) return;
  url.searchParams.set("page", parseInt(currentPage) + 1);
  window.location.href = url.toString();
};
