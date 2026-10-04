
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
const form = document.querySelector('#contact-form');
if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const note = document.querySelector('#form-note');
    note.textContent = 'The form design is ready. Connect a form service before publishing submissions.';
  });
}
