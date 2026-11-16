
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Heart, Download, Eye, UserRound, GraduationCap, UsersRound,
  MapPin, Camera, Check, ChevronRight, Sparkles, RotateCcw,
  ShieldCheck, X, Palette, Plus, Trash2, Frame, LoaderCircle,
  Pencil, FileText
} from "lucide-react";
import "./styles.css";

const EMPTY = {
  heading: "|| Shree Ganesh ||",
  title: "Bio Data",
  name: "", dob: "", birthPlace: "", gotra: "",
  height: "", complexion: "", religion: "", motherTongue: "",
  education: "", college: "", occupation: "", company: "", salary: "",
  grandfather: "", father: "", fatherOccupation: "",
  mother: "", motherOccupation: "",
  contact: "", address: "", about: "", partnerPreference: "",
  familyCustom: []
};

const TEMPLATES = [
  ["classic","Classic Maroon","#8b2635"],
  ["royal","Royal Gold","#9a7134"],
  ["minimal","Minimal Ivory","#536b70"],
  ["blush","Blush Rose","#b86f7b"],
  ["navy","Navy Heritage","#263a5a"],
  ["sage","Sage Garden","#687b5c"],
  ["terracotta","Terracotta","#b56545"],
  ["lavender","Lavender","#82749e"],
  ["emerald","Emerald","#286653"],
  ["burgundy","Burgundy","#722f42"],
  ["peacock","Peacock Teal","#167c80"],
  ["sunrise","Sunrise","#c47a35"],
  ["lotus","Lotus Pink","#bd668b"],
  ["sandal","Sandalwood","#9b7956"],
  ["ruby","Ruby Red","#a52d3a"],
  ["indigo","Indigo","#4d4c87"],
  ["olive","Olive Leaf","#737b3c"],
  ["copper","Copper Luxe","#a45e43"],
  ["charcoal","Charcoal","#45484d"],
  ["mogra","Mogra Cream","#927b68"]
].map(([id,name,color])=>({id,name,color}));

const BORDERS = [
  {id:"none",name:"No Border"},
  {id:"classic",name:"Classic"},
  {id:"double",name:"Double Line"},
  {id:"royal",name:"Royal Frame"}
];

const TABS = [
  {id:"personal",label:"Personal",icon:UserRound},
  {id:"education",label:"Education",icon:GraduationCap},
  {id:"family",label:"Family",icon:UsersRound},
  {id:"contact",label:"Contact",icon:MapPin}
];

function Field({label,value,onChange,placeholder,type="text"}) {
  return (
    <label className="field">
      <span>{label}<small>Optional</small></span>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        onChange={e=>onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({label,value,onChange}) {
  return (
    <label className="field full">
      <span>{label}<small>Optional</small></span>
      <textarea
        rows="3"
        value={value || ""}
        placeholder={`Enter ${label.toLowerCase()}`}
        onChange={e=>onChange(e.target.value)}
      />
    </label>
  );
}

function BiodataDocument({data,template,border,photo,documentRef}) {
  const theme=TEMPLATES.find(t=>t.id===template)||TEMPLATES[0];

  const custom=(data.familyCustom||[])
    .filter(x=>x.label?.trim() && x.value?.trim())
    .map(x=>[x.label,x.value]);

  const sections=[
    ["PERSONAL DETAILS",[
      ["Name",data.name],
      ["Date of Birth",data.dob],
      ["Place of Birth",data.birthPlace],
      ["Gotra",data.gotra],
      ["Height",data.height],
      ["Complexion",data.complexion],
      ["Religion",data.religion],
      ["Mother Tongue",data.motherTongue]
    ]],
    ["EDUCATION & CAREER",[
      ["Education",data.education],
      ["College / University",data.college],
      ["Occupation",data.occupation],
      ["Company / Workplace",data.company],
      ["Salary / Income",data.salary]
    ]],
    ["FAMILY DETAILS",[
      ["Grandfather's Name",data.grandfather],
      ["Father's Name",data.father],
      ["Father's Occupation",data.fatherOccupation],
      ["Mother's Name",data.mother],
      ["Mother's Occupation",data.motherOccupation],
      ...custom
    ]],
    ["ABOUT", [["About",data.about]]],
    ["PARTNER PREFERENCE",[
      ["Partner Preference",data.partnerPreference]
    ]],
    ["CONTACT DETAILS",[
      ["Contact Number",data.contact],
      ["Address",data.address]
    ]]
  ];

  const visibleSections=sections
    .map(([title,items])=>[
      title,
      items.filter(([,value])=>String(value||"").trim())
    ])
    .filter(([,items])=>items.length);

  return (
    <article
      ref={documentRef}
      className={`biodata-document theme-${template} border-${border}`}
      style={{"--accent":theme.color}}
    >
      <div className="doc-top-rule"/>

      <header className="doc-masthead">
        <img
          src="/ganesh.png"
          className="ganesh-art"
          alt="Shree Ganesh"
        />
        <div className="doc-mantra">
          {data.heading||"|| Shree Ganesh ||"}
        </div>
        <h1>{data.title||"Bio Data"}</h1>
        <div className="ornament"><i/><span>✦</span><i/></div>
      </header>

      <div className="doc-person">
        <div className="doc-person-copy">
          <h2>{data.name.trim()||"Your Name"}</h2>
          {data.birthPlace.trim() && <p>{data.birthPlace}</p>}
        </div>

        {photo ? (
          <img className="doc-photo" src={photo} alt="Profile"/>
        ) : (
          <div className="doc-photo photo-placeholder">
            <UserRound size={40}/>
            <small>PHOTO</small>
          </div>
        )}
      </div>

      {visibleSections.map(([title,items])=>(
        <section className="doc-section" key={title}>
          <h3>{title}</h3>

          {title==="ABOUT"||title==="PARTNER PREFERENCE" ? (
            <p className="doc-longtext">{items[0][1]}</p>
          ):(
            <div className="doc-fields">
              {items.map(([label,value],i)=>(
                <div className="doc-field" key={`${label}-${i}`}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <footer className="doc-end">|| शुभ विवाह ||</footer>
    </article>
  );
}

export default function App() {
  const [data,setData]=useState(()=>{
    try {
      return {
        ...EMPTY,
        ...JSON.parse(localStorage.getItem("rishta-biodata-v6")||"{}")
      };
    } catch {
      return {...EMPTY};
    }
  });

  const [template,setTemplate]=useState("classic");
  const [border,setBorder]=useState("classic");
  const [active,setActive]=useState("personal");
  const [photo,setPhoto]=useState("");
  const [saved,setSaved]=useState(false);
  const [loading,setLoading]=useState(false);
  const [previewOpen,setPreviewOpen]=useState(false);
  const [previewWidth,setPreviewWidth]=useState(700);
  const [docHeight,setDocHeight]=useState(1123);

  const fileRef=useRef(null);
  const previewAreaRef=useRef(null);
  const documentRef=useRef(null);

  useEffect(()=>{
    try {
      localStorage.setItem("rishta-biodata-v6",JSON.stringify(data));
      setSaved(true);
      const timer=setTimeout(()=>setSaved(false),1300);
      return ()=>clearTimeout(timer);
    } catch(e) {
      console.warn("Local storage unavailable",e);
    }
  },[data]);

  useEffect(()=>{
    if(!previewOpen) return;

    const area=previewAreaRef.current;
    const doc=documentRef.current;
    if(!area||!doc) return;

    const update=()=>{
      setPreviewWidth(area.clientWidth);
      setDocHeight(doc.scrollHeight);
    };

    const observer=new ResizeObserver(update);
    observer.observe(area);
    observer.observe(doc);
    update();

    return ()=>observer.disconnect();
  },[previewOpen,data,template,border,photo]);

  useEffect(()=>{
    if(!previewOpen) return;
    const old=document.body.style.overflow;
    document.body.style.overflow="hidden";

    const onKey=e=>{
      if(e.key==="Escape") setPreviewOpen(false);
    };

    window.addEventListener("keydown",onKey);
    return ()=>{
      document.body.style.overflow=old;
      window.removeEventListener("keydown",onKey);
    };
  },[previewOpen]);

  const update=(key,value)=>{
    setData(prev=>({...prev,[key]:value}));
  };

  const addFamily=()=>{
    update("familyCustom",[
      ...(data.familyCustom||[]),
      {id:crypto.randomUUID(),label:"",value:""}
    ]);
  };

  const editFamily=(id,key,value)=>{
    update("familyCustom",(data.familyCustom||[]).map(item=>
      item.id===id?{...item,[key]:value}:item
    ));
  };

  const removeFamily=id=>{
    update("familyCustom",(data.familyCustom||[]).filter(x=>x.id!==id));
  };

  const pickPhoto=e=>{
    const file=e.target.files?.[0];
    if(!file) return;

    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){
      alert("Please select JPG, PNG or WebP image.");
      e.target.value="";
      return;
    }

    if(file.size>5*1024*1024){
      alert("Image size must be below 5 MB.");
      e.target.value="";
      return;
    }

    const reader=new FileReader();
    reader.onload=()=>setPhoto(reader.result);
    reader.readAsDataURL(file);
    e.target.value="";
  };

  const downloadPDF=async()=>{
    const source=documentRef.current;
    if(!source||loading) return;

    setLoading(true);
    let host;

    try {
      await document.fonts.ready;

      host=document.createElement("div");
      host.className="pdf-render-host";

      const clone=source.cloneNode(true);
      clone.style.setProperty("position","relative","important");
      clone.style.setProperty("transform","none","important");
      clone.style.setProperty("left","auto","important");
      clone.style.setProperty("top","auto","important");
      clone.style.setProperty("width","794px","important");
      clone.style.setProperty("height","auto","important");
      clone.style.setProperty("min-height","1123px","important");
      clone.style.setProperty("overflow","visible","important");
      clone.style.setProperty("margin","0","important");

      host.appendChild(clone);
      document.body.appendChild(host);

      await Promise.all(
        [...clone.querySelectorAll("img")].map(img=>
          img.decode?.().catch(()=>Promise.resolve())
        )
      );

      await new Promise(resolve=>
        requestAnimationFrame(()=>requestAnimationFrame(resolve))
      );

      const canvas=await html2canvas(clone,{
        scale:2,
        backgroundColor:"#ffffff",
        useCORS:true,
        allowTaint:false,
        logging:false,
        width:794,
        windowWidth:900,
        scrollX:0,
        scrollY:0
      });

      const pdf=new jsPDF({
        orientation:"portrait",
        unit:"mm",
        format:"a4",
        compress:true
      });

      const pageW=210;
      const pageH=297;
      const imageH=canvas.height/canvas.width*pageW;
      const fit=Math.min(1,pageH/imageH);
      const w=pageW*fit;
      const h=imageH*fit;

      pdf.addImage(
        canvas.toDataURL("image/jpeg",0.96),
        "JPEG",
        (pageW-w)/2,
        (pageH-h)/2,
        w,
        h,
        undefined,
        "FAST"
      );

      const filename=(data.name.trim()||"Marriage-Biodata")
        .replace(/[^a-z0-9-_]/gi,"-")+".pdf";

      pdf.save(filename);

    } catch(error) {
      console.error("PDF export error:",error);
      alert("PDF generate nahi hua. Please refresh and try again.");
    } finally {
      host?.remove();
      setLoading(false);
    }
  };

  const reset=()=>{
    if(!window.confirm("Are you sure you want to clear all biodata details?")) return;
    setData({...EMPTY});
    setPhoto("");
    setTemplate("classic");
    setBorder("classic");
    localStorage.removeItem("rishta-biodata-v6");
  };

  const renderForm=()=>{
    if(active==="personal"){
      return (
        <>
          <SectionHeading
            icon={UserRound}
            title="Personal details"
            desc="Basic information about the person."
          />
          <div className="form-grid">
            <Field label="Full name" value={data.name} onChange={v=>update("name",v)}/>
            <Field label="Date of birth" value={data.dob} onChange={v=>update("dob",v)} placeholder="DD-MM-YYYY"/>
            <Field label="Place of birth" value={data.birthPlace} onChange={v=>update("birthPlace",v)}/>
            <Field label="Gotra" value={data.gotra} onChange={v=>update("gotra",v)}/>
            <Field label="Height" value={data.height} onChange={v=>update("height",v)}/>
            <Field label="Complexion" value={data.complexion} onChange={v=>update("complexion",v)}/>
            <Field label="Religion" value={data.religion} onChange={v=>update("religion",v)}/>
            <Field label="Mother tongue" value={data.motherTongue} onChange={v=>update("motherTongue",v)}/>
          </div>

          <div className="photo-upload">
            <div className="photo-thumb">
              {photo?<img src={photo} alt="Profile"/>:<Camera size={21}/>}
            </div>
            <div className="photo-copy">
              <b>Profile photograph</b>
              <span>Optional · JPG, PNG, WebP · Max 5 MB</span>
            </div>
            <button className="btn soft small" onClick={()=>fileRef.current?.click()}>
              Choose
            </button>
            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={pickPhoto}
            />
            {photo&&<button className="icon-btn" onClick={()=>setPhoto("")}><Trash2 size={15}/></button>}
          </div>

          <div className="form-grid top-fields">
            <Field label="Top heading" value={data.heading} onChange={v=>update("heading",v)}/>
            <Field label="Document title" value={data.title} onChange={v=>update("title",v)}/>
          </div>
        </>
      );
    }

    if(active==="education"){
      return (
        <>
          <SectionHeading
            icon={GraduationCap}
            title="Education & career"
            desc="Add education and professional information."
          />
          <div className="form-grid">
            <Field label="Education / Qualification" value={data.education} onChange={v=>update("education",v)}/>
            <Field label="College / University" value={data.college} onChange={v=>update("college",v)}/>
            <Field label="Occupation" value={data.occupation} onChange={v=>update("occupation",v)}/>
            <Field label="Company / Workplace" value={data.company} onChange={v=>update("company",v)}/>
            <Field label="Salary / Annual income" value={data.salary} onChange={v=>update("salary",v)} placeholder="Optional"/>
          </div>
        </>
      );
    }

    if(active==="family"){
      return (
        <>
          <SectionHeading
            icon={UsersRound}
            title="Family details"
            desc="Add family information as needed."
          />
          <div className="form-grid">
            <Field label="Grandfather's name" value={data.grandfather} onChange={v=>update("grandfather",v)}/>
            <Field label="Father's name" value={data.father} onChange={v=>update("father",v)}/>
            <Field label="Father's occupation" value={data.fatherOccupation} onChange={v=>update("fatherOccupation",v)}/>
            <Field label="Mother's name" value={data.mother} onChange={v=>update("mother",v)}/>
            <Field label="Mother's occupation" value={data.motherOccupation} onChange={v=>update("motherOccupation",v)}/>
          </div>

          <div className="custom-head">
            <div>
              <b>Additional family members</b>
              <small>Brother, sister, uncle, aunt and more.</small>
            </div>
            <button className="btn soft small" onClick={addFamily}>
              <Plus size={15}/> Add field
            </button>
          </div>

          {(data.familyCustom||[]).length===0&&(
            <div className="empty-custom">
              No additional fields. Click Add field to create one.
            </div>
          )}

          {(data.familyCustom||[]).map((item,i)=>(
            <div className="custom-row" key={item.id}>
              <span className="custom-index">{String(i+1).padStart(2,"0")}</span>
              <input
                placeholder="Field name"
                aria-label="Family field name"
                value={item.label}
                onChange={e=>editFamily(item.id,"label",e.target.value)}
              />
              <input
                placeholder="Enter details"
                aria-label="Family field value"
                value={item.value}
                onChange={e=>editFamily(item.id,"value",e.target.value)}
              />
              <button className="icon-btn delete" onClick={()=>removeFamily(item.id)} aria-label="Delete field">
                <Trash2 size={15}/>
              </button>
            </div>
          ))}
        </>
      );
    }

    return (
      <>
        <SectionHeading
          icon={MapPin}
          title="Contact & additional details"
          desc="Only share the information you want."
        />
        <div className="form-grid">
          <Field label="Contact number" value={data.contact} onChange={v=>update("contact",v)}/>
          <Field label="Address" value={data.address} onChange={v=>update("address",v)}/>
          <TextArea label="About" value={data.about} onChange={v=>update("about",v)}/>
          <TextArea label="Partner preference" value={data.partnerPreference} onChange={v=>update("partnerPreference",v)}/>
        </div>
      </>
    );
  };

  const currentIndex=TABS.findIndex(t=>t.id===active);
  const previewScale=Math.min(1,previewWidth/794);

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" onClick={e=>e.preventDefault()}>
          <span className="brand-icon"><Heart fill="currentColor" size={18}/></span>
          <span>Sangam<span className="brand-dot">.</span>
            <small>BIODATA STUDIO</small>
          </span>
        </a>

        <div className="top-actions">
          <span className="save-state"><i/>{saved?"Saved":"Workspace"}</span>
          <button className="btn outline small reset-button" onClick={reset}>
            <RotateCcw size={14}/> Reset
          </button>
          <button className="btn primary small" onClick={()=>setPreviewOpen(true)}>
            <Eye size={15}/> Preview
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <div className="eyebrow"><Sparkles size={14}/> TRADITION MEETS ELEGANCE</div>
            <h1>Create your marriage <em>biodata.</em></h1>
            <p>Share your story with a thoughtfully designed biodata. Fill in your details, choose a style and download your PDF.</p>
          </div>
          <div className="privacy-chip">
            <ShieldCheck size={16}/> Your details stay on this device
          </div>
        </section>

        <section className="editor card">
          <div className="panel-head">
            <div>
              <span className="step">01 / YOUR DETAILS</span>
              <h2>Build your profile</h2>
            </div>
            <span className="autosave"><Check size={14}/> Auto-saved</span>
          </div>

          <nav className="tabs">
            {TABS.map((tab,i)=>{
              const Icon=tab.icon;
              return (
                <button
                  key={tab.id}
                  className={active===tab.id?"active":""}
                  onClick={()=>setActive(tab.id)}
                >
                  <Icon size={18}/>
                  <span>{tab.label}</span>
                  {currentIndex>i&&<Check className="tab-check" size={12}/>}
                </button>
              );
            })}
          </nav>

          <div className="form-body">{renderForm()}</div>

          <div className="form-bottom">
            <span>All fields are optional. Empty fields won't appear in your PDF.</span>
            <div className="form-nav">
              {currentIndex>0&&(
                <button className="btn outline small" onClick={()=>setActive(TABS[currentIndex-1].id)}>
                  Back
                </button>
              )}
              <button
                className="btn primary"
                onClick={()=>{
                  if(currentIndex===3) setPreviewOpen(true);
                  else setActive(TABS[currentIndex+1].id);
                }}
              >
                {currentIndex===3?"Preview biodata":"Next section"}
                <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        </section>

        <section className="below-actions">
          <div>
            <span className="step">02 / FINISH YOUR DESIGN</span>
            <h2>Ready to see your biodata?</h2>
            <p>Choose your design and view the complete A4 document before downloading.</p>
          </div>
          <button className="btn primary preview-main-btn" onClick={()=>setPreviewOpen(true)}>
            <Eye size={17}/> Preview Biodata
          </button>
        </section>

        <div className="privacy-note">
          <ShieldCheck size={17}/>
          <span><b>Your privacy matters.</b> Details are saved in this browser. No account or backend is used.</span>
        </div>
      </main>

      {previewOpen&&(
        <div className="preview-backdrop" onMouseDown={e=>{
          if(e.target===e.currentTarget) setPreviewOpen(false);
        }}>
          <section className="preview-modal" role="dialog" aria-modal="true" aria-label="Biodata preview">
            <header className="modal-head">
              <div>
                <span className="step">02 / LIVE PREVIEW</span>
                <h2>Your biodata</h2>
              </div>
              <div className="modal-actions">
                <button className="btn outline small edit-btn" onClick={()=>setPreviewOpen(false)}>
                  <Pencil size={14}/> Edit details
                </button>
                <button className="btn primary small" onClick={downloadPDF} disabled={loading}>
                  {loading?<LoaderCircle className="spin" size={15}/>:<Download size={15}/>}
                  {loading?"Preparing...":"Download PDF"}
                </button>
                <button className="icon-btn modal-close" onClick={()=>setPreviewOpen(false)} aria-label="Close preview">
                  <X size={18}/>
                </button>
              </div>
            </header>

            <div className="modal-controls">
              <div className="template-box">
                <div className="template-title">
                  <b><Palette size={15}/> Choose template</b>
                  <span>20 styles</span>
                </div>
                <div className="template-grid">
                  {TEMPLATES.map(t=>(
                    <button
                      key={t.id}
                      className={`template-choice ${template===t.id?"selected":""}`}
                      onClick={()=>setTemplate(t.id)}
                    >
                      <span className="swatch" style={{"--swatch":t.color}}>
                        <b/><b/><b/>
                      </span>
                      <span>{t.name}</span>
                      {template===t.id&&<Check size={12}/>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-box">
                <div className="template-title">
                  <b><Frame size={15}/> PDF border style</b>
                  <span>4 options</span>
                </div>
                <div className="border-options">
                  {BORDERS.map(item=>(
                    <button
                      key={item.id}
                      className={`border-choice ${border===item.id?"selected":""}`}
                      onClick={()=>setBorder(item.id)}
                    >
                      <span className={`border-sample sample-${item.id}`}/>
                      <span>{item.name}</span>
                      {border===item.id&&<Check size={12}/>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="preview-canvas" ref={previewAreaRef}>
              <div className="preview-scale" style={{height:docHeight*previewScale}}>
                <BiodataDocument
                  documentRef={documentRef}
                  data={data}
                  template={template}
                  border={border}
                  photo={photo}
                  ref={null}
                />
              </div>
            </div>

            <footer className="modal-foot">
              <span><Eye size={14}/> Document preview · A4 PDF format</span>
              <span>Made with care by <b>Abhinav</b></span>
            </footer>
          </section>
        </div>
      )}

      <footer className="footer">
        <div className="footer-brand">
          <Heart size={15} fill="currentColor"/> Made with care by <strong>Abhinav</strong>
        </div>
        <span className="footer-tag">CRAFTED FOR YOUR SPECIAL BEGINNING</span>
        <span>© 2026 Sangam Biodata Studio</span>
      </footer>
    </div>
  );
}

function SectionHeading({icon:Icon,title,desc}) {
  return (
    <div className="section-title">
      <div className="section-icon"><Icon size={18}/></div>
      <div><h3>{title}</h3><p>{desc}</p></div>
    </div>
  );
}
