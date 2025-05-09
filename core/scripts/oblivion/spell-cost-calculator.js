class SkillLevelCalculator {

    constructor() {

        this.$skillLevelInput = $("#txt-skill-level");
        this.$magickaCostInput = $("#txt-magicka-cost");
        this.$isTargetedInput = $("#chk-is-targeted");

        this.$baseMagickaDisplay = $("[data-display='base-magicka']");
        this.$requiredRankDisplay = $("[data-display='required-rank']");
    }

    addEventListeners = () => {

        this.$skillLevelInput.on("change", () => {

            this.recalculateSpellCost();
        });

        this.$magickaCostInput.on("change", () => {

            this.recalculateSpellCost();
        });

        this.$isTargetedInput.on("change", () => {

            this.recalculateSpellCost();
        });
    }

    recalculateSpellCost = () => {

        this.hideErrors();

        if (!this.validate()) return;

        const skillLevel = this.$skillLevelInput.val().trim();
        const magickaCost = this.$magickaCostInput.val().trim();
        const isTargeted = this.$isTargetedInput.is(":checked");
        const baseMagickaCost = Math.ceil(isTargeted ? magickaCost / (2.1 - 0.018 * skillLevel) : magickaCost / (1.4 - 0.012 * skillLevel));

        this.$baseMagickaDisplay.text(baseMagickaCost);
        
        this.displayRequiredRank(baseMagickaCost);
    }

    displayRequiredRank(baseMagickaCost) {

        if (baseMagickaCost < 26) {

            this.$requiredRankDisplay.text("Novice (Level 0+)");
        }
        else if (baseMagickaCost < 63) {

            this.$requiredRankDisplay.text("Apprentice (Level 25+)");
        }
        else if (baseMagickaCost < 150) {

            this.$requiredRankDisplay.text("Journeyman (Level 50+)");
        }
        else if (baseMagickaCost < 400) {

            this.$requiredRankDisplay.text("Expert (Level 75+)");
        }
        else {

            this.$requiredRankDisplay.text("Master (Level 100)");
        }

    }

    validate = () => {

        const skillLevel = this.$skillLevelInput.val().trim();
        if (skillLevel === "") {

            this.displayError("Please enter a skill level", this.$skillLevelInput);
            return false;
        }

        if (isNaN(skillLevel)) {

            this.displayError("Skill level must be numeric (no letters)", this.$skillLevelInput)
            return false;
        }

        if (+skillLevel < 0) {

            this.displayError("Skill level cannot be lower than 0", this.$skillLevelInput)
            return false;
        }

        if (+skillLevel > 116) {

            this.displayError("Skill level cannot be higher than 116", this.$skillLevelInput)
            return false;
        }

        const magickaCost = this.$magickaCostInput.val().trim();
        if (magickaCost === "") {

            this.displayError("Please enter a magicka cost", this.$magickaCostInput);
            return false;
        }

        if (isNaN(magickaCost)) {

            this.displayError("Magicka cost must be numeric (no letters)", this.$magickaCostInput);
            return false;
        }

        return true;
    }

    displayError = (message, $field) => {

        const $error = $("<div>").addClass("error").text(message);

        const $wrapper = $field.parents(".row");
        $wrapper.append($error);
    }

    hideErrors = () => {

        const errors = document.getElementsByClassName("error");
        for (let index = 0; index < errors.length; index++) {

            const error = errors[index];
            const parent = error.parentNode;
            parent.removeChild(error);
        }
    }
}

(() => {

    const skillLevelCalculator = new SkillLevelCalculator();
    skillLevelCalculator.addEventListeners();
})();