import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/ngx-canvas-app/ui/base/base.component';
import { EventDescription, PlaneService } from 'src/app/ngx-canvas-app/ui/services/plane.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

enum ProtocolModuleState {
    ACTIVE = 'active',
    LOST = 'lost',
    DEFAULT = 'default'
}

class ProtocolModule {
    public readonly eventDescription: EventDescription;

    public get isActive(): boolean {
        return this._state === ProtocolModuleState.ACTIVE;
    }

    public get isLost(): boolean {
        return this._state === ProtocolModuleState.LOST;
    }

    private _state: ProtocolModuleState = ProtocolModuleState.DEFAULT;

    public constructor(description: EventDescription) {
        this.eventDescription = description;
    }

    public setState(nextState: ProtocolModuleState): void {
        this._state = nextState;
    }
}

@Component({
    selector: 'ngx-protocols-wrapper',
    templateUrl: './ngx-protocols-wrapper.component.html',
    styleUrls: ['./ngx-protocols-wrapper.component.scss']
})
export class NgxProtocolsWrapperComponent extends BaseComponent implements OnInit {
    public get isLastElementActive(): boolean {
        return this._protocolModulesSubject.value.at(-1)?.isActive || this.isProtocolModulesStackEmpty;
    }

    public get protocolModulesObservable(): Observable<ProtocolModule[]> {
        return this._protocolModulesSubject.asObservable();
    }

    @ViewChild(CdkVirtualScrollViewport)
    private _viewPort?: CdkVirtualScrollViewport;

    private set _descriptions(value: EventDescription[]) {
        this._eventDescriptionsSubject.next(value);
    }

    private get _descriptions(): EventDescription[] {
        return this._eventDescriptionsSubject.value;
    }

    public get isProtocolModulesStackEmpty(): boolean {
        return this._protocolModulesSubject.value.length === 0 || this._protocolModulesSubject.value.at(0)?.isLost;
    }

    private _eventDescriptionsSubject = new BehaviorSubject<EventDescription[]>([]);
    private _protocolModulesSubject = new BehaviorSubject<ProtocolModule[]>([]);

    public constructor(private planeService: PlaneService) {
        super();
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.nextEventDescription.subscribe(descriptions => this.setEventDescriptions(descriptions))
        );
    }

    public onMouseEnterProtocolModule(index: number): void {
        const lastIndex = this._protocolModulesSubject.value.length - 1;
        for (let i = lastIndex; i > index; --i) {
            this._protocolModulesSubject.value.at(i).setState(ProtocolModuleState.LOST);
        }
    }

    public onMouseLeaveProtocolModule(index: number): void {
        const lastIndex = this._protocolModulesSubject.value.length - 1;
        for (let i = index; i < lastIndex; ++i) {
            this._protocolModulesSubject.value.at(i).setState(ProtocolModuleState.DEFAULT);
        }
        this.setLastDescriptionToActive();
    }

    private setEventDescriptions(descriptions: EventDescription[]): void {
        this._descriptions = descriptions;
        this._protocolModulesSubject.next(descriptions.map(description => this.createProtocolModule(description)));
        this.setLastDescriptionToActive();
        this.scrollToBottom();
    }

    private createProtocolModule(description: EventDescription): ProtocolModule {
        return new ProtocolModule(description);
    }

    private setLastDescriptionToActive(): void {
        const lastProtocolModule = this._protocolModulesSubject.value.at(-1);
        lastProtocolModule.setState(ProtocolModuleState.ACTIVE);
    }

    private scrollToBottom(): void {
        const doScroll = () => this._viewPort?.scrollToOffset(this._descriptions.length * 30, 'auto');
        setTimeout(() => doScroll(), 1);
        setTimeout(() => doScroll(), 10);
    }
}
