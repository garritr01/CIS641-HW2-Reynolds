function addListener(log = 0) {
    window.addEventListener("message", function (event) {
        /*
        //Security feature
        if (event.origin !== "https://your-trusted-origin.com") {
            return;
        }
        */
        if (event.data.type === 'resize') {
            iframes.push(event.data.elementID+'Frame');
            const contents = document.getElementById(event.data.elementID+'Frame');
            contents.style.height = event.data.height + 'px';
            contents.style.width = event.data.width + 'px';
            log > 0 && console.log(`${event.data.elementID} resized to (h = ${event.data.height}, w = ${event.data.width})`);
            log > 1 && console.log('resize listener states:',resizeState);
        }
    }, false);
}

function postResizeDimensions(elementID, log = 0) {
    log > 1 && console.log(`Attempting to resize ${elementID}`);
    const body = document.getElementById(elementID);
    const computedStyle = window.getComputedStyle(body);
    const xMargin = parseInt(computedStyle.marginLeft) + parseInt(computedStyle.marginRight);
    const yMargin = parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);
    const height = body.scrollHeight+xMargin; //+ 1.5*parseFloat(computedStyle.fontSize);
    const width = body.scrollWidth+yMargin;
    log > 0 && console.log(`${elementID} asked to resize to (h=${height},w=${width})`);
    parent.postMessage({ type: 'resize', elementID, height, width }, "*"); // Send the dimensions to the parent window
}

function expansionCorrection(log = 0) {
    document.querySelectorAll('.acronym').forEach(acronym =>{
        acronym.addEventListener('mouseenter', function (){
            log > 0 && console.log('-- -- -- expansion -- -- --');
            const expandBox = this.querySelector('.expand');
            
            expandBox.style.display = '-webkit-box';
            expandBox.style.left = `${-50 * (expandBox.offsetWidth / this.offsetWidth - 1)}%`;

            const expandRect = expandBox.getBoundingClientRect();
            const acroRect = this.getBoundingClientRect();
            
            const width = document.body.scrollWidth;
            const bodyStyle = window.getComputedStyle(document.body);
            const paddingLeft = parseInt(bodyStyle.marginLeft, 10);
            const expandStyle = window.getComputedStyle(expandBox);
            const xPadding = parseInt(expandStyle.paddingLeft) + parseInt(expandStyle.paddingRight);

            let i = 1;
            while ((expandRect.width+xPadding) > i*width) {
                i++;
            }
            if (i > 1) {
                console.log(i,expandRect.width,width);
                expandBox.style.top = `-${i*100}%`;
                expandBox.style.whiteSpace = 'normal';
                expandBox.style.width = `${width}px`;
                expandBox.style.webkitLineClamp = `${i}`;
                expandBox.style.left = `${-100 * (acroRect.left - paddingLeft) / acroRect.width}%`;
                expandBox.style.right = 'auto';
            } else {
                if (expandRect.top <= 0) {
                    expandBox.style.top = '100%';
                    log > 0 && console.log(`Expansion placed below ${acroRect.top}px`);
                } else if (log > 0) {
                    console.log(`Expansion placed above ${acroRect.top}px`);
                }

                if (expandRect.right > width) {
                    expandBox.style.right = `${100*(acroRect.right - width) / acroRect.width}%`;
                    expandBox.style.left = 'auto';
                    log > 0 && console.log(`Expansion pinned to right @ ${width}px`);
                } else if (expandRect.left < 0) {
                    expandBox.style.left = `${-100*(acroRect.left - paddingLeft) / acroRect.width}%`;
                    expandBox.style.right = 'auto';
                    log > 0 && console.log(`Expansion pinned to left @ 0px`);
                } else if (log > 0) {
                    console.log(`Expansion centered at ${(acroRect.left + acroRect.right)/2}`);
                }
            }

            if (log > 1) {
                console.log(`screen width: ${width}`);
                console.log(`acronymEdge: ${acroRect.right}`);
                console.log(`paddingLeft: ${paddingLeft}`);
                console.log('acronym',acroRect);
                console.log('initial expansion', expandRect);
                console.log('updated expansion',expandBox.getBoundingClientRect());
            }
        });

        acronym.addEventListener('mouseleave', function () {
            const expandBox = this.querySelector('.expand');

            // Reset styles back to initial values
            expandBox.style.display = 'none';
            expandBox.style.position = 'absolute';
            expandBox.style.top = '-100%';
            expandBox.style.backgroundColor = '#d7e5ee';
            expandBox.style.border = '1px solid #4c4c6f';
            expandBox.style.whiteSpace = 'nowrap';

            // Explicitly clear left and right to avoid lingering values
            expandBox.style.left = '';
            expandBox.style.right = '';
            expandBox.style.width = '';
            expandBox.style.webkitLineClamp = '';
        });
    });
}

function dropdown(log = 0) {
    document.querySelectorAll('.dropdownLink').forEach(dLink => {
        dLink.addEventListener('click', function (event) {
            event.stopPropagation();
            
            log > 0 && console.log('-- -- -- dropdown link -- -- --');
            
            const name = this.getAttribute("tag");
            const ddBox = document.querySelector(`.dropdown[tag="${name}"]`);
            const computedStyle = window.getComputedStyle(this);

            log > 0 && console.log(`tag: ${name}`);
            
            if (ddBox.style.display === "block") {
                ddBox.style.display = 'none';
                log > 1 && console.log("removing visibility of: ",ddBox.textContent);
            } else {
                ddBox.style.display = 'block';
                log > 1 && console.log("displaying: ",ddBox.textContent);
            }
        });
    });
}
