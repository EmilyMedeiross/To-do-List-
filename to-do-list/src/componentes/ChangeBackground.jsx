import './ChangeBackground.css'

function ChangeBackground() {
    function handleColor() {
        var element = document.body;
        element.classList.toggle("dark-mode");
        
        var htmlElement = document.documentElement;
        htmlElement.classList.toggle("dark-theme");
    }

    return (
        <div>
            <button onClick={handleColor}>Alternar Tema</button>
        </div>
    )
}

export default ChangeBackground