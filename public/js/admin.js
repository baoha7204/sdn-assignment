document.addEventListener("DOMContentLoaded", function () {
  // Handle delete brand form submissions
  const deleteBrandForms = document.querySelectorAll(".delete-brand-form");
  if (deleteBrandForms) {
    deleteBrandForms.forEach((form) => {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const confirmDelete = await showConfirmDialog(
          "Are you sure you want to delete this brand? This action cannot be undone."
        );
        if (confirmDelete) {
          form.submit();
        }
      });
    });
  }

  // Handle delete perfume form submissions
  const deletePerfumeForms = document.querySelectorAll(".delete-perfume-form");
  if (deletePerfumeForms) {
    deletePerfumeForms.forEach((form) => {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const confirmDelete = await showConfirmDialog(
          "Are you sure you want to delete this perfume? This action cannot be undone."
        );
        if (confirmDelete) {
          form.submit();
        }
      });
    });
  }

  // Create modal for confirmation
  function createConfirmDialog() {
    const modalHtml = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmModalLabel">Confirmation</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p id="confirmMessage"></p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn danger" id="confirmButton">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  // Create the confirmation dialog if it doesn't exist
  if (!document.getElementById("confirmModal")) {
    createConfirmDialog();
  }

  // Function to show confirm dialog and return promise
  function showConfirmDialog(message) {
    return new Promise((resolve) => {
      const modal = new bootstrap.Modal(
        document.getElementById("confirmModal")
      );
      const confirmButton = document.getElementById("confirmButton");
      document.getElementById("confirmMessage").textContent = message;

      const handleConfirm = () => {
        modal.hide();
        confirmButton.removeEventListener("click", handleConfirm);
        resolve(true);
      };

      confirmButton.addEventListener("click", handleConfirm);

      modal._element.addEventListener(
        "hidden.bs.modal",
        () => {
          confirmButton.removeEventListener("click", handleConfirm);
          resolve(false);
        },
        { once: true }
      );

      modal.show();
    });
  }
});
