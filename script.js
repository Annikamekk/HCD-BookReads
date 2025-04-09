const slider = document.getElementById("fontSizeSlider");
        const paragraphs = document.querySelectorAll("p"); // Alle <p>-elementen selecteren
        const fontSizeValue = document.getElementById("fontSizeValue");

        slider.addEventListener("input", function() {
            let size = slider.value + "px";
            fontSizeValue.textContent = size;
            
            // Loop door alle <p>-elementen en pas de font-size aan
            paragraphs.forEach(p => {
                p.style.fontSize = size;
            });
        });

        const lineHeightSlider = document.getElementById("lineHeightSlider");
        const lineHeightValue = document.getElementById("lineHeightValue");
        
        lineHeightSlider.addEventListener("input", function() {
            let lineHeight = lineHeightSlider.value;
            lineHeightValue.textContent = lineHeight;
        
            paragraphs.forEach(p => {
                p.style.lineHeight = lineHeight;
            });
        });
        
        const fontWeightSlider = document.getElementById("fontWeightSlider");
        const fontWeightValue = document.getElementById("fontWeightValue");
        
        fontWeightSlider.addEventListener("input", function () {
            let weight = fontWeightSlider.value;
            fontWeightValue.textContent = weight;
        
            paragraphs.forEach(p => {
                p.style.fontWeight = weight;
            });
        });




        // document.querySelectorAll('p').forEach(paragraph => {
        //     paragraph.addEventListener('keydown', function (e) {
        //       if (e.key === 'Enter') {
        //         e.preventDefault();
        //         toggleNoteBlock(this);
        //       }
        //     });
        //   });
      
        //   function toggleNoteBlock(p) {
        //     if (p.nextElementSibling && p.nextElementSibling.classList.contains('note-block')) {
        //       // Als de note block al bestaat, focus erop
        //       p.nextElementSibling.querySelector('textarea').focus();
        //     } else {
        //       // Maak nieuwe note block
        //       const noteBlock = document.createElement('div');
        //       noteBlock.className = 'note-block';
      
        //       const textarea = document.createElement('textarea');
        //       textarea.setAttribute('aria-label', 'Voer hier je aantekening in');
      
        //       const saveBtn = document.createElement('button');
        //       saveBtn.textContent = 'Opslaan';
        //       saveBtn.onclick = () => {
        //         p.classList.add('highlighted');
        //         textarea.disabled = true;
        //         saveBtn.disabled = true;
        //       };
      
        //       const deleteBtn = document.createElement('button');
        //       deleteBtn.textContent = 'Verwijderen';
        //       deleteBtn.onclick = () => {
        //         noteBlock.remove();
        //         p.classList.remove('highlighted');
        //       };
      
        //       const resetBtn = document.createElement('button');
        //       resetBtn.textContent = 'Opnieuw beginnen';
        //       resetBtn.onclick = () => {
        //         textarea.value = '';
        //         textarea.disabled = false;
        //         saveBtn.disabled = false;
        //       };
      
        //       noteBlock.appendChild(textarea);
        //       noteBlock.appendChild(saveBtn);
        //       noteBlock.appendChild(deleteBtn);
        //       noteBlock.appendChild(resetBtn);
      
        //       p.insertAdjacentElement('afterend', noteBlock);
        //       textarea.focus();
        //     }
        //   }


    // let noteCount = 0;
    // const noteLinksContainer = document.getElementById('note-links');

    // document.querySelectorAll('p').forEach(paragraph => {
    //   paragraph.addEventListener('keydown', function (e) {
    //     if (e.key === 'Enter') {
    //       e.preventDefault();
    //       toggleNoteBlock(this);
    //     }
    //   });
    // });

    // function toggleNoteBlock(p) {
    //   if (p.nextElementSibling && p.nextElementSibling.classList.contains('note-block')) {
    //     p.nextElementSibling.querySelector('textarea').focus();
    //     return;
    //   }

    //   const noteBlock = document.createElement('div');
    //   noteBlock.className = 'note-block';

    //   const textarea = document.createElement('textarea');
    //   textarea.setAttribute('aria-label', 'Voer hier je aantekening in');

    //   const saveBtn = document.createElement('button');
    //   saveBtn.textContent = 'Opslaan';
    //   saveBtn.onclick = () => {
    //     const noteText = textarea.value.trim();
    //     if (!noteText) return alert('Aantekening is leeg.');

    //     p.classList.add('highlighted');
    //     noteBlock.remove();

    //     noteCount++;
    //     addNoteToTopSection(noteCount, noteText);
    //   };

    //   const cancelBtn = document.createElement('button');
    //   cancelBtn.textContent = 'Verwijderen';
    //   cancelBtn.onclick = () => {
    //     noteBlock.remove();
    //   };

    //   const resetBtn = document.createElement('button');
    //   resetBtn.textContent = 'Opnieuw beginnen';
    //   resetBtn.onclick = () => {
    //     textarea.value = '';
    //   };

    //   noteBlock.appendChild(textarea);
    //   noteBlock.appendChild(saveBtn);
    //   noteBlock.appendChild(cancelBtn);
    //   noteBlock.appendChild(resetBtn);

    //   p.insertAdjacentElement('afterend', noteBlock);
    //   textarea.focus();
    // }

    // function addNoteToTopSection(number, text) {
    //   const noteEntry = document.createElement('div');
    //   noteEntry.className = 'note-entry';

    //   const button = document.createElement('h3');
    //   button.textContent = `Aantekening ${number}`;
    //   button.setAttribute('aria-label', `Toon aantekening ${number}`);

    //   const noteText = document.createElement('div');
    //   noteText.className = 'note-text';
    //   noteText.textContent = text;

    //   button.onclick = () => {
    //     const allNotes = document.querySelectorAll('.note-text');
    //     allNotes.forEach(n => n.style.display = 'none');
    //     noteText.style.display = 'block';
    //   };

    //   noteEntry.appendChild(button);
    //   noteEntry.appendChild(noteText);
    //   noteLinksContainer.appendChild(noteEntry);
    // }

    let noteCount = 0;
    const noteLinksContainer = document.getElementById('note-links');

    document.querySelectorAll('p').forEach(paragraph => {
      paragraph.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          toggleNoteBlock(this);
        }
      });
    });

    function toggleNoteBlock(p) {
      if (p.nextElementSibling && p.nextElementSibling.classList.contains('note-block')) {
        p.nextElementSibling.querySelector('textarea').focus();
        return;
      }

      const noteBlock = document.createElement('div');
      noteBlock.className = 'note-block';

      const textarea = document.createElement('textarea');
      textarea.setAttribute('aria-label', 'Voer hier je aantekening in');

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Opslaan';

      // Enter om op te slaan
      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          saveNote();
        }
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Verwijderen';
      cancelBtn.onclick = () => {
        noteBlock.remove();
      };

      const resetBtn = document.createElement('button');
      resetBtn.textContent = 'Opnieuw beginnen';
      resetBtn.onclick = () => {
        textarea.value = '';
      };

      function saveNote() {
        const noteText = textarea.value.trim();
        if (!noteText) return alert('Aantekening is leeg.');

        p.classList.add('highlighted');
        noteBlock.remove();

        noteCount++;
        addNoteToTopSection(noteCount, noteText);
      }

      saveBtn.onclick = saveNote;

      noteBlock.appendChild(textarea);
      noteBlock.appendChild(saveBtn);
      noteBlock.appendChild(cancelBtn);
      noteBlock.appendChild(resetBtn);

      p.insertAdjacentElement('afterend', noteBlock);
      textarea.focus();
    }

    // function addNoteToTopSection(number, text) {
    //   const noteEntry = document.createElement('div');
    //   noteEntry.className = 'note-entry';

    //   const h3 = document.createElement('h3');
    //     h3.textContent = `Aantekening ${number}`;
    //   h3.setAttribute('aria-label', `Toon aantekening ${number}`);

    //   const noteText = document.createElement('div');
    //   noteText.className = 'note-text';
    //   noteText.textContent = text;

    //   h3.onclick = () => {
    //     const allNotes = document.querySelectorAll('.note-text');
    //     allNotes.forEach(n => n.style.display = 'none');
    //     noteText.style.display = 'block';
    //     noteText.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   };

    //   noteEntry.appendChild(h3);
    //   noteEntry.appendChild(noteText);
    //   noteLinksContainer.appendChild(noteEntry);
    // }

    function addNoteToTopSection(number, text) {
        const noteEntry = document.createElement('div');
        noteEntry.className = 'note-entry';
      
        const noteText = document.createElement('div');
        noteText.className = 'note-text';
        noteText.style.display = 'block'; // altijd zichtbaar
        noteText.textContent = text;
      
        noteEntry.appendChild(noteText);
        noteLinksContainer.appendChild(noteEntry);
      }