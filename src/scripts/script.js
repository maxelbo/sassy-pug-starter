document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('change-text-button');
  const paragraph = document.getElementById('text-to-change');
  const changeText = () => {
    paragraph.textContent = 'This is an example.';
  };
  button.addEventListener('click', changeText);
});
