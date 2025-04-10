document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const requiredFields = form.querySelectorAll('[required]');
  const checkbox = form.querySelector('input[type="checkbox"]');
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  
  // Initially disable the submit button
  submitBtn.disabled = true;
  
  // Function to check if all required fields are filled
  function checkFormValidity() {
    let allFilled = true;
    
    // Check required text/email fields
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
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
    submitBtn.disabled = !(allFilled && radioSelected && isChecked);
  }
  
  // Add event listeners to all form elements
  form.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('input', checkFormValidity);
    element.addEventListener('change', checkFormValidity);
  });
  
  // Add event listener to checkbox
  checkbox.addEventListener('change', checkFormValidity);
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    
    // Get form data
    const formData = new FormData(form);
    formData.append('_replyto', form.querySelector('input[type="email"]').value);
    formData.append('_subject', `新しいお問い合わせ: ${formData.get('company')} - ${formData.get('name')}`);
    formData.append('_cc', 'bikash4jp@gmail.com');
    
    // Send email using Formspree
    fetch('https://formspree.io/f/xrbprkko', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Show success message
        form.innerHTML = `
          <div class="success-message" style="text-align: center; padding: 40px;">
            <h3>送信が完了しました</h3>
            <p>当社の代表者が折り返しご連絡いたしますので、少々お待ちください。</p>
            <p>5秒後にトップページに自動的に戻ります。</p>
          </div>
        `;
        
        // Redirect to index.html after 5 seconds
        setTimeout(function() {
          window.location.href = 'index.html';
        }, 5000);
      } else {
        throw new Error('送信に失敗しました');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('エラーが発生しました: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
  });
});