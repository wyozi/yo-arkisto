## yo-arkisto

Oldish (~2015) helper application for studying for the matriculation exams in Finland.

![](http://i.imgur.com/syf4CcP.png)

### Features
- Displays both questions and answers (if available) at once.
- PDFs are rendered using pdf.js  
- Ability to draw on top of PDFs (in practice mostly used for doodling) 
- Floating Wolfram Alpha panel for quick questions

### Usage
- IIRC you can just add an exam to path `public/kokeet/{subject-id}/(k|s){year as 2 digits}.pdf` and everything will just work.
	Example path: `public/kokeet/fy/k06.pdf` and answers at `public/kokeet/fy/k06ratk.pdf`.
- `node index.js` and open at `http://localhost:5000`
	- For Wolfram Alpha support set the `WOLFRAM_API` environment variable to wolfram alpha API key.