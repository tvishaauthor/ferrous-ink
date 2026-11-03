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

const newsletter=document.querySelector('#newsletter-form');
if(newsletter){
  const status=newsletter.querySelector('#newsletter-status');
  const submit=newsletter.querySelector('#newsletter-submit');
  newsletter.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!newsletter.checkValidity()){
      newsletter.reportValidity();
      return;
    }
    submit.disabled=true;
    submit.textContent='Joining…';
    status.textContent='Adding you to the reader list…';
    try{
      const response=await fetch(newsletter.action,{
        method:'POST',
        body:new FormData(newsletter),
        headers:{'Accept':'application/json'}
      });
      if(response.ok){
        newsletter.reset();
        status.textContent='Thank you. Your signup was received. Advance copies are offered in signup order.';
      }else{
        let data={};
        try{data=await response.json();}catch(_e){}
        const detail=data.errors?.map(x=>x.message).filter(Boolean).join(' ');
        status.textContent=detail||'Your signup could not be sent. Please check your email and try again.';
      }
    }catch(_e){
      status.textContent='Your signup could not be sent. Please check your connection and try again.';
    }finally{
      submit.disabled=false;
      submit.textContent='Join the List';
    }
  });
}

async function loadMediumTapovanCover(){
  const covers=[...document.querySelectorAll('img[data-tapovan-cover="medium"]')];
  if(!covers.length)return;
  try{
    const files=['part0.txt','part1.txt'];
    const parts=await Promise.all(files.map(name=>fetch(`assets/images/tapovan-medium-data/${name}?v=18`).then(r=>{
      if(!r.ok)throw new Error('medium cover');
      return r.text();
    })));
    const src='data:image/jpeg;base64,'+parts.join('').trim();
    covers.forEach(img=>{img.src=src;});
  }catch(_e){
    /* Leave the built-in cover visible if the medium source fails. */
  }
}

async function loadLargeTapovanCover(){
  const covers=[...document.querySelectorAll('img[data-tapovan-cover="large"]')];
  if(!covers.length)return;
  try{
    const data=await fetch('assets/images/tapovan-cover-hd.b64?v=18').then(r=>{
      if(!r.ok)throw new Error('large cover');
      return r.text();
    });
    const src='data:image/jpeg;base64,'+data.trim();
    covers.forEach(img=>{img.src=src;});
  }catch(_e){
    /* Leave the built-in cover visible if the large source fails. */
  }
}

loadMediumTapovanCover();
loadLargeTapovanCover();
