
/*jshint -W079 */

interface ICountToData {
	element: HTMLElement;
	timeoutPromise?: angular.IPromise<any>;
	refreshInterval?: number;
	duration?: number;
	step?: number;
	steps?: number;
	countTo?: number;
	value?: number;
	increment?: number;
	num?: number;
}

export class CountToDirective implements angular.IDirective {

	restrict = "A";

	link: (scope: angular.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

	constructor(
		private $timeout: angular.ITimeoutService,
		private $filter: angular.IFilterService) {

		CountToDirective.prototype.link = ($scope: angular.IScope, $element: angular.IAugmentedJQuery, attrs: ng.IAttributes) => {

			var countToData: ICountToData = {
				element: $element[0]
			};

			attrs.$observe("countTo", (val) => {
				if (val) {
					this.start(countToData, attrs);
				}
			});
		}
	}

	start(countToData: ICountToData, attrs: ng.IAttributes) {
		if (countToData && countToData.timeoutPromise) {
			this.$timeout.cancel(countToData.timeoutPromise);
		}

		this.calculate(countToData, attrs);
		this.tick(countToData);
	}

	private calculate(countToData: ICountToData, attrs: ng.IAttributes) {
		countToData.refreshInterval = 30;
		countToData.step = 0;
		countToData.timeoutPromise = null;
		countToData.value = countToData.countTo || 0;
		countToData.countTo = parseInt(attrs["countTo"]) || 0;
		countToData.duration = (parseFloat(attrs["duration"]) * 1000) || 250; // default half second

		countToData.steps = Math.ceil(countToData.duration / countToData.refreshInterval);
		countToData.increment = ((countToData.countTo - countToData.value) / countToData.steps);
		countToData.num = countToData.value;
	}

	private tick(countToData: ICountToData) {
		countToData.timeoutPromise = this.$timeout(() => {
			countToData.num += countToData.increment;
			countToData.step++;

			if (countToData.step >= countToData.steps) {
				this.$timeout.cancel(countToData.timeoutPromise);
				countToData.num = countToData.countTo;

				this.setContent(countToData, countToData.countTo);
			} else {
				this.setContent(countToData, Math.round(countToData.num));

				this.tick(countToData);
			}
		}, countToData.refreshInterval);
	}

	private setContent(countToData: ICountToData, value:number) {
		countToData.element.textContent = this.$filter("number")(value);
	}

	static factory(): ng.IDirectiveFactory {
		const directive = ($timeout: angular.ITimeoutService, $filter: angular.IFilterService) => new CountToDirective($timeout, $filter);

		directive.$inject = ["$timeout", "$filter"];

		return directive;
	}
}


angular
	.module("app.directives")
	.directive("countTo", CountToDirective.factory());