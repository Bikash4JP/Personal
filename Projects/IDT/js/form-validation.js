document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const requiredFields = form.querySelectorAll('[required]');
    const radioGroup = document.getElementById('inquiry-group');
    const agreeCheckbox = document.getElementById('agree-checkbox');
    
    // Error message elements
    const errorMessages = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        phone: document.getElementById('phone-error'),
        company: document.getElementById('company-error'),
        inquiry: document.getElementById('inquiry-error'),
        agree: document.getElementById('agree-error')
    };

    // Initialize form validation
    validateForm();
    
    // Real-time validation
    form.addEventListener('input', validateForm);
    form.addEventListener('change', validateForm);
    
    // Radio group and checkbox need special handling
    radioGroup.addEventListener('change', validateForm);
    agreeCheckbox.addEventListener('change', validateForm);
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('必須項目をすべて正しく入力してください');
            return;
        }
        
        // Set loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '送信中...';
        
        try {
            // Prepare form data
            const formData = new FormData(form);
            formData.append('_cc', 'bikash4jp@gmail.com');
            formData.append('_subject', `【ITF問い合わせ】${formData.get('company')} - ${formData.get('name')}`);
            
            // Send to Formspree
            const response = await fetch('https://formspree.io/f/xrbprkko', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Redirect after 5 seconds
                let seconds = 5;
                const redirectMsg = document.getElementById('redirectMessage');
                const timer = setInterval(() => {
                    seconds--;
                    redirectMsg.textContent = `${seconds}秒後にトップページに自動的に戻ります。`;
                    
                    if (seconds <= 0) {
                        clearInterval(timer);
                        window.location.href = 'index.html';
                    }
                }, 1000);
            } else {
                throw new Error(`サーバーエラー: ${response.status}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            
            // Fallback to mailto if Formspree fails
            if (confirm('フォーム送信に失敗しました。メールで直接送信しますか？')) {
                const formData = new FormData(form);
                const mailtoBody = [
                    `氏名: ${formData.get('name')}`,
                    `メール: ${formData.get('email')}`,
                    `電話: ${formData.get('phone')}`,
                    `会社名: ${formData.get('company')}`,
                    `問い合わせ種類: ${formData.get('inquiry')}`,
                    `メッセージ: ${formData.get('message') || '未記入'}`,
                    '',
                    '※このメールはフォーム送信失敗時に代替手段として送信されました'
                ].join('%0A');
                
                window.location.href = `mailto:bikash4jp@gmail.com?subject=【ITF問い合わせ】${encodeURIComponent(formData.get('company'))}&body=${mailtoBody}`;
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        Object.values(errorMessages).forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        
        // Validate required fields
        requiredFields.forEach(field => {
            const fieldName = field.name || field.id.replace('-checkbox', '');
            const errorEl = errorMessages[fieldName];
            
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                errorEl.textContent = 'この項目への同意が必要です';
                errorEl.style.display = 'block';
            } 
            else if (!field.value.trim()) {
                isValid = false;
                errorEl.textContent = 'この項目は必須です';
                errorEl.style.display = 'block';
            }
        });
        
        // Validate radio group
        const radioChecked = document.querySelector('input[name="inquiry"]:checked');
        if (!radioChecked) {
            isValid = false;
            errorMessages.inquiry.textContent = 'お問い合わせ内容を選択してください';
            errorMessages.inquiry.style.display = 'block';
        }
        
        // Validate email format
        const email = form.querySelector('input[type="email"]').value;
        if (email && !validateEmail(email)) {
            isValid = false;
            errorMessages.email.textContent = '有効なメールアドレスを入力してください';
            errorMessages.email.style.display = 'block';
        }
        
        // Validate phone format
        const phone = form.querySelector('input[type="tel"]').value;
        if (phone && !validatePhone(phone)) {
            isValid = false;
            errorMessages.phone.textContent = '有効な電話番号を入力してください (10-11桁の数字)';
            errorMessages.phone.style.display = 'block';
        }
        
        submitBtn.disabled = !isValid;
        return isValid;
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^[0-9]{10,11}$/;
        return re.test(phone);
    }
});