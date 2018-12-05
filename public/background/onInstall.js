chrome.runtime.onInstalled.addListener(
    (details) => {
        if(details.reason == "install"){
            alert(`Thanks for installing BetterVRV!\n\nThe default controls are similar to YouTube's keyboard shortcuts, but you can customize the controls (and the rest of this extension) to your liking in the options page.\n\nDo note that content blockers like uBlock Origin and AdBlock may impact BetterVRV's functionality. Consider disabling these on https://vrv.co/.`);
        }else if(details.reason == "update"){
            //
        }
    }
);
