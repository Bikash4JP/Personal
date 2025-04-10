document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    const submitBtn = document.getElementById('submit-button');
    const requiredFields = form.querySelectorAll('[required]');
    const checkbox = form.querySelector('input[name="agree_policy"]');
    const radioButtons = form.querySelectorAll('input[name="inquiry"]');
    
    // Initially disable the submit button
    if (submitBtn) submitBtn.disabled = true;
    
    function checkFormValidity() {
      if (!form) return;
      
      let allFilled = true;
      
      // Check required text/email fields
      requiredFields.forEach(field => {
        if (field.type !== 'checkbox' && field.type !== 'radio' && !field.value.trim()) {
          allFilled = false;
        }
      });
      
      // Check if at least one radio button is selected
      let radioSelected = false;
      radioButtons.forEach(radio => {
        if (radio.checked) radioSelected = true;
      });
      
      // Check if checkbox is checked
      const isChecked = checkbox.checked;
      
      // Enable/disable button based on conditions
      if (submitBtn) {
        submitBtn.disabled = !(allFilled && radioSelected && isChecked);
      }
    }
    
    // Add event listeners to all form elements
    if (form) {
      form.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', checkFormValidity);
        element.addEventListener('change', checkFormValidity);
      });
      
      // Add event listener to checkbox
      if (checkbox) {
        checkbox.addEventListener('change', checkFormValidity);
      }
    }
  });