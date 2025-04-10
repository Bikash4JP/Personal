class FormHandler {
    constructor() {
      this.form = document.getElementById('inquiryForm');
      this.submitBtn = document.getElementById('submitBtn');
      this.successMessage = document.getElementById('successMessage');
      this.redirectMessage = document.getElementById('redirectMessage');
      this.requiredFields = Array.from(this.form.querySelectorAll('[required]'));
      this.init();
    }
  
    init() {
      this.setupEventListeners();
      this.validateForm();
    }
  
    setupEventListeners() {
      // Real-time validation on input
      this.form.addEventListener('input', () => this.validateForm());
      
      // Special handling for radio buttons and checkbox
      this.form.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => this.validateForm());
      });
      
      this.form.querySelector('input[type="checkbox"]').addEventListener('change', () => this.validateForm());
      
      // Form submission
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  
    validateForm() {
      const isFormValid = this.checkFormValidity();
      this.submitBtn.disabled = !isFormValid;
      return isFormValid;
    }
  
    checkFormValidity() {
      // Check required fields
      const fieldsValid = this.requiredFields.every(field => {
        if (field.type === 'checkbox') return field.checked;
        if (field.type === 'radio') {
          return Array.from(document.getElementsByName(field.name)).some(r => r.checked);
        }
        return field.value.trim() !== '';
      });
      
      // Additional validation for email format
      const emailValid = this.validateEmail(this.form.querySelector('[name="email"]').value);
      
      return fieldsValid && emailValid;
    }
  
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      
      if (!this.validateForm()) {
        alert('必須項目をすべて入力してください');
        return;
      }
  
      this.setLoadingState(true);
      
      try {
        const formData = new FormData(this.form);
        const response = await this.sendFormData(formData);
        
        if (response.ok) {
          this.showSuccess();
          this.startRedirectTimer();
        } else {
          throw new Error('サーバーエラーが発生しました');
        }
      } catch (error) {
        console.error('Error:', error);
        this.handleSubmissionError(error);
      } finally {
        this.setLoadingState(false);
      }
    }
  
    async sendFormData(formData) {
      // Using Formspree
      formData.append('_cc', 'bikash4jp@gmail.com,another@email.com');
      formData.append('_subject', `新しいお問い合わせ: ${formData.get('company')}`);
      
      return fetch('https://formspree.io/f/xrbprkko', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
    }
  
    setLoadingState(isLoading) {
      this.submitBtn.disabled = isLoading;
      this.submitBtn.textContent = isLoading ? '送信中...' : '送信する';
    }
  
    showSuccess() {
      this.form.style.display = 'none';
      this.successMessage.style.display = 'block';
    }
  
    startRedirectTimer() {
      let seconds = 5;
      this.redirectMessage.textContent = `${seconds}秒後にトップページに自動的に戻ります。`;
      
      const timer = setInterval(() => {
        seconds--;
        this.redirectMessage.textContent = `${seconds}秒後にトップページに自動的に戻ります。`;
        
        if (seconds <= 0) {
          clearInterval(timer);
          window.location.href = 'index.html';
        }
      }, 1000);
    }
  
    handleSubmissionError(error) {
      alert(`送信に失敗しました: ${error.message}`);
      
      // Fallback mailto option
      if (confirm('メールクライアントで送信しますか？')) {
        const formData = new FormData(this.form);
        const mailtoBody = [
          `氏名: ${formData.get('name')}`,
          `メール: ${formData.get('email')}`,
          `電話: ${formData.get('phone') || '未記入'}`,
          `会社名: ${formData.get('company')}`,
          `問い合わせ種類: ${formData.get('inquiry')}`,
          `メッセージ: ${formData.get('message') || '未記入'}`,
          '',
          '※このメールはフォーム送信失敗時に代替手段として送信されました'
        ].join('%0A');
        
        window.location.href = `mailto:bikash4jp@gamil.com?subject=お問い合わせ: ${encodeURIComponent(formData.get('company'))}&body=${mailtoBody}`;
      }
    }
  }
  
  // Initialize the form handler when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => new FormHandler());