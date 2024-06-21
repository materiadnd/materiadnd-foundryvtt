# Materia D&D 5e for Foundry VTT 

This repository contains the customized content for the Materia D&D 5e campaign setting for use with the Foundry Virtual Tabletop.

## Developing with this module

To setup this module for development with your own local instance of Foundry, do the following.


### Setup the appropriate folder
1. Find your [Foundry User Data directory](https://foundryvtt.com/article/user-data/).
2. In the `Data/Modules` directory within your Foundry User Data directory, clone this repository into a folder named `materia-dnd` (the name must match the module name from the module manifest).

### Create the compendium packs
3. First, we need to install [Node.js / npm](https://nodejs.org/en/download) as that is what will be used to manage the packages used by this module for compiling/decompiling the compendium packs.
4. Once installed, go into the `materia-dnd` directory and run:  `npm i` to install the prerequisite packages.
5. Once you've successfully installed all the packages, you can run the `build` scripts.  To create compendium packs from the JSON files in the `packs/_source` directory, run:  `npm run build:db`  and wait for it to complete.  Once this is done, you should have several new folders under the `packs` folder, one for each new compendium entry.

At this point, you can launch foundry and you should see the "Materia D&D" module among the list of installed modules.  Install it in a dnd5e world and make sure you see the Materia compendium folder with all of the child compendiums inside to ensure this has worked.

### Decompiling the compendium packs into JSON
If you have made changes inside of Foundry and wish to reflect them in the JSON files, either to make further updates or to check in to source control.  You will run the command `npm run build:json` from within the `materia-dnd` directory.  This will **overwrite** any existing `.json` files, so make sure you have any changes that are not already in the Foundry db files saved.

