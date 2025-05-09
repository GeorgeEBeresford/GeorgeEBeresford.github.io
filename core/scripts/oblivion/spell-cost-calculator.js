class SkillLevelCalculator {

    constructor() {

        this.$skillLevelInput = $("#txt-skill-level");
        this.$luckLevelInput = $("#txt-luck-level");
        this.$magickaCostInput = $("#txt-magicka-cost");
        this.$isTargetedInput = $("#chk-is-targeted");

        this.$baseMagickaDisplay = $("[data-display='base-magicka']");
        this.$requiredRankDisplay = $("[data-display='required-rank']");

        this.$needsSkillLevelWrapper = $("[data-wrapper='NeedsSkillLevel']");
    }

    addEventListeners () {

        this.$skillLevelInput.on("change", () => {

            this.hideErrors(this.$skillLevelInput);

            this.displayMagickaCosts();
            this.recalculateSpellCost();
            this.recalculateMinMax();
        });

        this.$luckLevelInput.on("change", () => {

            this.hideErrors(this.$luckLevelInput);

            this.displayLuckModifier();
            this.displayMagickaCosts();
            this.recalculateSpellCost();
            this.recalculateMinMax();
        });

        this.$magickaCostInput.on("change", () => {

            this.hideErrors(this.$magickaCostInput);
            this.recalculateSpellCost();
        });

        this.$isTargetedInput.on("change", () => {

            this.hideErrors(this.$isTargetedInput);
            this.recalculateSpellCost();
            this.recalculateMinMax();
        });
    }

    getLuckModifier() {

        const luckLevel = +this.$luckLevelInput.val().trim();
        return (0.4 * (luckLevel - 50));
    }

    getMagickaCostModifier () {

        const skillLevel = +this.$skillLevelInput.val().trim();
        const luckModifier = this.getLuckModifier();
        const isTargeted = this.$isTargetedInput.is(":checked");
        const effectiveSkillLevel = skillLevel + luckModifier;

        const modifier = isTargeted ? (2.1 - 0.018 * effectiveSkillLevel) : (1.4 - 0.012 * effectiveSkillLevel);
        return modifier;
    }

    displayError = (message, $field) => {

        const $wrapper = $field.parents(".row").first();
        const $existingError = $wrapper.find(".error");
        if ($existingError.length !== 0){

            $existingError.text(message);
            return;
        }

        const $error = $("<div>").addClass("error").text(message);
        $wrapper.append($error);
    }

    displayLuckModifier() {

        if (!this.validateLuckLevel()) return;

        const luckModifier = Math.floor(this.getLuckModifier() * 100) / 100;
        const $display = $("[data-display='luck-modifier']");

        $display.text(luckModifier > 0 ? `+${luckModifier}` : luckModifier);
    }

    displayMagickaCosts () {

        if (!this.validateSkillLevel() || !this.validateLuckLevel()) {

            this.$needsSkillLevelWrapper.hide();
        }
        else {

            this.$needsSkillLevelWrapper.show();
        }
    }

    displayRequiredRank(baseMagickaCost) {

        if (!this.validateSkillLevel()) return;
        if (!this.validateLuckLevel()) return;

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

    hideErrors = ($field) => {

        const $parent = $field.parents(".row").first();
        const $errors = $parent.find(".error");

        $errors.each((_, error) => {

            const $error = $(error);
            $error.remove();
        });
    }

    recalculateSpellCost () {

        if (!this.validateSkillLevel()) return;
        if (!this.validateLuckLevel()) return;
        if (!this.validateMagickaCost()) return;

        const magickaCost = this.$magickaCostInput.val().trim();
        const modifier = this.getMagickaCostModifier();
        const baseMagickaCost = Math.ceil(magickaCost / modifier);

        this.$baseMagickaDisplay.text(baseMagickaCost);

        this.displayRequiredRank(baseMagickaCost);
    }

    recalculateMinMax () {

        if (!this.validateSkillLevel() || !this.validateLuckLevel){

            $("[data-display='novice-max-cost']").text("???");

            $("[data-display='apprentice-min-cost']").text("???");
            $("[data-display='apprentice-max-cost']").text("???");

            $("[data-display='journeyman-min-cost']").text("???");
            $("[data-display='journeyman-max-cost']").text("???");

            $("[data-display='expert-min-cost']").text("???");
            $("[data-display='expert-max-cost']").text("???");

            $("[data-display='master-min-cost']").text("???");
            return;
        }

        const modifier = this.getMagickaCostModifier();

        const minLevelApprentice = Math.floor(26 * modifier);
        const minLevelJourneyman = Math.floor(63 * modifier);
        const minLevelExpert = Math.floor(150 * modifier);
        const minLevelMaster = Math.floor(400 * modifier);

        $("[data-display='novice-max-cost']").text(minLevelApprentice - 1);

        $("[data-display='apprentice-min-cost']").text(minLevelApprentice);
        $("[data-display='apprentice-max-cost']").text(minLevelJourneyman - 1);

        $("[data-display='journeyman-min-cost']").text(minLevelJourneyman);
        $("[data-display='journeyman-max-cost']").text(minLevelExpert - 1);

        $("[data-display='expert-min-cost']").text(minLevelExpert);
        $("[data-display='expert-max-cost']").text(minLevelMaster - 1);

        $("[data-display='master-min-cost']").text(minLevelMaster);
    }

    validateSkillLevel () {

        const skillLevel = this.$skillLevelInput.val().trim();

        if (skillLevel === "") {

            return false;
        }

        if (isNaN(skillLevel)) {

            this.displayError("Skill level must be numeric (no letters)", this.$skillLevelInput);
            return false;
        }

        if (+skillLevel < 0) {

            this.displayError("Skill level cannot be lower than 0", this.$skillLevelInput);
            return false;
        }

        if (+skillLevel > 116) {

            this.displayError("Skill level cannot be higher than 116", this.$skillLevelInput);
            return false;
        }

        return true;
    }

    validateLuckLevel () {

        const luckLevel = this.$luckLevelInput.val().trim();

        if (luckLevel === "") {

            return false;
        }

        if (isNaN(luckLevel)) {

            this.displayError("Luck level must be numeric (no letters)", this.$luckLevelInput);
            return false;
        }

        if (+luckLevel < 0) {

            this.displayError("Luck level cannot be lower than 0", this.$luckLevelInput);
            return false;
        }

        if (+luckLevel > 100) {

            this.displayError("Luck level cannot be higher than 100", this.$luckLevelInput);
            return false;
        }

        return true;
    }

    validateMagickaCost () {

        const magickaCost = this.$magickaCostInput.val().trim();
        if (isNaN(magickaCost)) {

            this.displayError("Magicka cost must be numeric (no letters)", this.$magickaCostInput);
            return false;
        }

        if (+magickaCost < 0) {

            this.displayError("Magicka cost cannot be lower than 0", this.$magickaCostInput);
            return false;
        }

        return true;
    }
}

(() => {

    const skillLevelCalculator = new SkillLevelCalculator();
    skillLevelCalculator.addEventListeners();
})();