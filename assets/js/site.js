document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

const f=document.querySelector('#contact-form');
if(f){
  const message=f.querySelector('#message');
  const counter=f.querySelector('#message-count');
  const note=f.querySelector('#form-note');
  const submit=f.querySelector('#contact-submit');

  const updateCounter=()=>{
    const n=message.value.length;
    counter.textContent=`${n} / 500 characters`;
  };
  message.addEventListener('input',updateCounter);
  updateCounter();

  f.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!f.checkValidity()){
      f.reportValidity();
      return;
    }
    if(message.value.length>500){
      note.textContent='Please shorten your message to 500 characters or fewer.';
      return;
    }

    submit.disabled=true;
    submit.textContent='Sending…';
    note.textContent='Sending your message…';

    try{
      const response=await fetch(f.action,{
        method:'POST',
        body:new FormData(f),
        headers:{'Accept':'application/json'}
      });
      if(response.ok){
        f.reset();
        updateCounter();
        note.textContent='Thank you. Your message has been sent successfully.';
      }else{
        let data={};
        try{data=await response.json();}catch(_e){}
        const detail=data.errors?.map(x=>x.message).filter(Boolean).join(' ');
        note.textContent=detail||'Your message could not be sent. Please check the form and try again.';
      }
    }catch(_e){
      note.textContent='Your message could not be sent. Please check your connection and try again.';
    }finally{
      submit.disabled=false;
      submit.textContent='Send Message';
    }
  });
}