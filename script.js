console.log("Script loaded!");

// === Load Surah List (for index.html) ===
if (document.getElementById("surah-list")) {
  fetch("data/surahs.json")
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(surahs => {
      const list = document.getElementById("surah-list");
      surahs.forEach(surah => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `surah.html?number=${surah.number}&name=${encodeURIComponent(surah.name)}`;
        a.textContent = `${surah.number}. ${surah.name}`;
        li.appendChild(a);
        list.appendChild(li);
      });
    })
    .catch(error => console.error("Error loading surahs:", error));
}

// === Load Individual Surah (for surah.html) ===
const urlParams = new URLSearchParams(window.location.search);
const surahNumber = urlParams.get('number') || '2'; // fallback default
const surahName = urlParams.get('name') || 'Al-Baqarah'; // fallback name

if (document.getElementById("surah-container")) {
  fetch(`data/surah-${surahNumber}.json`)
    .then(response => response.json())
    .then(data => {
      displaySurah(data);
    })
    .catch(error => console.error('Error loading surah:', error));
}

function displaySurah(data) {
  const container = document.getElementById('surah-container');

  // Surah title
  const surahTitle = document.createElement('h2');
  surahTitle.textContent = `Surah: ${data.surah_name || surahName}`;
  container.appendChild(surahTitle);

  data.ayahs.forEach(ayah => {
    const ayahBlock = document.createElement('div');
    ayahBlock.classList.add('ayah-block');

    // Ayah number + Arabic text
    const ayahText = document.createElement('h3');
    ayahText.textContent = `${ayah.number}. ${ayah.text}`;
    ayahBlock.appendChild(ayahText);

    // === Word-by-word table flipped horizontally (RTL layout) ===
    const wordTable = document.createElement('table');
    wordTable.classList.add('word-horizontal');
    wordTable.dir = "rtl";

    // Top Row: Arabic
    const arabicRow = document.createElement('tr');
    arabicRow.innerHTML = ayah.words.map(word => `<th>${word.arabic || '-'}</th>`).join('');
    wordTable.appendChild(arabicRow);

    // Urdu
    const urduRow = document.createElement('tr');
    urduRow.innerHTML = ayah.words.map(word => `<td>${word.urdu || '-'}</td>`).join('');
    wordTable.appendChild(urduRow);

    // Urdu Transliteration (Eng)
    const engRow = document.createElement('tr');
    engRow.innerHTML = ayah.words.map(word => `<td>${word.urduTranslitEng || '-'}</td>`).join('');
    wordTable.appendChild(engRow);

    // Urdu Transliteration (Telugu)
    const telRow = document.createElement('tr');
    telRow.innerHTML = ayah.words.map(word => `<td>${word.urduTranslitTelugu || '-'}</td>`).join('');
    wordTable.appendChild(telRow);

    ayahBlock.appendChild(wordTable);

    // === Translations ===
    const translationBlock = document.createElement('div');
    translationBlock.classList.add('translations');
    translationBlock.innerHTML = `
      <p><strong>English:</strong> ${ayah.translation.english || '-'}</p>
      <p><strong>Urdu:</strong> ${ayah.translation.urdu || '-'}</p>
      <p><strong>Urdu Transliteration (Eng):</strong> ${ayah.translation.urduTranslitEng || '-'}</p>
      <p><strong>Urdu Transliteration (Telugu):</strong> ${ayah.translation.urduTranslitTelugu || '-'}</p>
    `;

    ayahBlock.appendChild(translationBlock);
    container.appendChild(ayahBlock);
  });
}
