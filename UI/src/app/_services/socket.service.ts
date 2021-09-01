import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BusOption } from '../_models/BusOption';
import { CloudClient } from '../_models/CloudClient';
import { CloudDestination } from '../_models/CloudDestination';
import { Message } from '../_models/Message';
import { Device } from '../_models/Device';
import { DeviceAction } from '../_models/DeviceAction';
import { DeviceSource } from '../_models/DeviceSource';
import { DeviceState } from '../_models/DeviceState';
import { ListenerClient } from '../_models/ListenerClient';
import { VmixClient } from '../_models/VmixClient';
import { LogItem } from '../_models/LogItem';
import { OutputType } from '../_models/OutputType';
import { OutputTypeDataFields } from '../_models/OutputTypeDataFields';
import { Port } from '../_models/Port';
import { Source } from '../_models/Source';
import { SourceTallyData } from '../_models/SourceTallyData';
import { SourceType } from '../_models/SourceType';
import { SourceTypeBusOptions } from '../_models/SourceTypeBusOptions';
import { SourceTypeDataFields } from '../_models/SourceTypeDataFields';
import { TSLClient } from '../_models/TSLClient';
import { ErrorReport } from '../_models/ErrorReport';
import { ErrorReportsListElement } from '../_models/ErrorReportsListElement';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;
  public devices: Device[] = [];
  public deviceStates: DeviceState[] = [];
  public currentDeviceIdx?: number;
  public mode_preview?: boolean;
  public mode_program?: boolean;
  public listenerClients: ListenerClient[] = [];
  public vmixClients: VmixClient[] = [];
  public sources: Source[] = [];
  public busOptions: BusOption[] = [];
  public initialDataLoaded = false;
  public version?: string;
  public interfaces: any[] = [];
  public logs: LogItem[] = [];
  public tallyData: LogItem[] = [];
  public sourceTypes: SourceType[] = [];
  public sourceTypeDataFields: SourceTypeDataFields[] = [];
  public testModeOn = false;
  public tslclients_1secupdate?: boolean;
  public deviceSources: DeviceSource[] = [];
  public sourceTallyData: Record<string, SourceTallyData[]> = {};
  public sourceTypesBusOptions: SourceTypeBusOptions[] = [];
  public deviceActions: DeviceAction[] = [];
  public outputTypes: OutputType[] = [];
  public outputTypeDataFields: OutputTypeDataFields[] = [];
  public tslClients: TSLClient[] = [];
  public cloudDestinations: CloudDestination[] = [];
  public cloudKeys: string[] = [];
  public cloudClients: CloudClient[] = [];
  public portsInUse: Port[] = [];
  public messages: Message[] = [];
  public errorReports: ErrorReportsListElement[] = [] as ErrorReportsListElement[];

  public dataLoaded = new Promise<void>((resolve) => this._resolveDataLoadedPromise = resolve);
  private _resolveDataLoadedPromise!: () => void;

  public newLogsSubject = new Subject();
  public scrollTallyDataSubject = new Subject();
  public scrollChatSubject = new Subject();
  public closeModals = new Subject();
  public deviceStateChanged = new Subject<{device: Device, states: DeviceState[]}>();


  constructor() {
    this.socket = io();
    this.socket.on('sources', (sources: Source[]) => {
      this.sources = this.prepareSources(sources);
    });
    this.socket.on('devices', (devices: Device[]) => {
      this.devices = devices;
      this._resolveDataLoadedPromise();
      this.setupDeviceStates();
    });
    this.socket.on('bus_options', (busOptions: BusOption[]) => {
      this.busOptions = busOptions;
    });
    this.socket.on('listener_clients', (listenerClients: ListenerClient[]) => {
      for (const device of this.devices) {
        device.listenerCount = 0;
      }
      this.listenerClients = listenerClients.map((l: any) => {
        l.ipAddress = l.ipAddress.replace('::ffff:', '');
        l.device = this.devices.find((d) => d.id == l.deviceId);
        if (!l.inactive) l.device.listenerCount += 1;
        return l;
      }).sort((a: any, b: any) => (a.inactive === b.inactive)? 0 : a.inactive ? 1 : -1);
    });
    this.socket.on('vmix_clients', (vmix_clients: VmixClient[]) => {
      this.vmixClients = vmix_clients.map((l: any) => {
        l.host = l.host.replace('::ffff:', '');
        return l;
      })
    });
    this.socket.on('device_states', (states: DeviceState[]) => {
      this.deviceStates = states;
      this.setupDeviceStates();
    });
    this.socket.on("messaging", (type: "server" | "client" | "producer", socketId: string, message: string) => {
      this.messages.push({
        type,
        socketId,
        text: message,
        date: new Date(),
      });
      this.scrollChatSubject.next();
    });
    this.socket.on("version", (version: string) => {
      this.version = version;
    });
    this.socket.on("interfaces", (interfaces: any[]) => {
      interfaces.forEach((net_interface) => {
        this.interfaces.push({
          name: net_interface.name,
          address: net_interface.address,
          url: `http://${net_interface.address}:4455/#/tally`
        });
      });
    });
    this.socket.on("logs", (logs: LogItem[]) => {
      this.logs = logs;
      this.newLogsSubject.next();
    });
    this.socket.on("log_item", (log: LogItem) => {
      if (this.logs.length > 5000) {
        this.logs.shift();
      }
      this.logs.push(log);
      this.newLogsSubject.next();
    });
    this.socket.on("source_tallydata", (sourceId: string, data: SourceTallyData[]) => {
      this.sourceTallyData[sourceId] = data;
    });
    this.socket.on('tally_data', (sourceId: string, tallyObj: SourceTallyData) => {
      if (this.tallyData.length > 5000) {
        this.tallyData.shift();
      }
      let tallyPreview = (tallyObj.tally1 === 1 ? 'True' : 'False');
      let tallyProgram = (tallyObj.tally2 === 1 ? 'True' : 'False');
      this.tallyData.push({
        datetime: Date.now().toString(),
        log: `Source: ${this.getSourceById(sourceId)?.name}  Address: ${tallyObj.address}  Label: ${tallyObj.label}  PVW: ${tallyPreview}  PGM: ${tallyProgram}`,
        type: 'info',
      });
      this.scrollTallyDataSubject.next();
    });
    this.socket.on('device_sources', (deviceSources: DeviceSource[]) => {
      this.deviceSources = deviceSources;
    });
    this.socket.on('device_actions', (deviceActions: DeviceAction[]) => {
      this.deviceActions = deviceActions;
    });
    this.socket.on('tsl_clients', (clients: TSLClient[]) => {
      this.tslClients = clients;
    });
    this.socket.on('cloud_destinations', (destinations: CloudDestination[]) => {
      this.cloudDestinations = destinations;
    });
    this.socket.on('cloud_keys', (keys: string[]) => {
      this.cloudKeys = keys;
    });
    this.socket.on('cloud_clients', (clients: CloudClient[]) => {
      this.cloudClients = clients;
    });
    this.socket.on('initialdata', (sourceTypes: SourceType[], sourceTypesDataFields: SourceTypeDataFields[], sourceTypesBusOptions: SourceTypeBusOptions[], outputTypes: OutputType[], outputTypesDataFields: OutputTypeDataFields[], busOptions: BusOption[], sourcesData: Source[], devicesData: Device[], deviceSources: DeviceSource[], deviceActions: DeviceAction[], deviceStates: DeviceState[], tslClients: TSLClient[], cloudDestinations: CloudDestination[], cloudKeys: string[], cloudClients: CloudClient[]) => {
      this.initialDataLoaded = true;
      this.sourceTypes = sourceTypes.filter((s: SourceType) => s.enabled);
      this.sourceTypeDataFields = sourceTypesDataFields;
      this.sourceTypesBusOptions = sourceTypesBusOptions;
      this.outputTypes = outputTypes;
      this.outputTypeDataFields = outputTypesDataFields;
      this.busOptions = busOptions;
      this.sources =  this.prepareSources(sourcesData);
      this.devices = devicesData;
      this.deviceSources = deviceSources;
      this.deviceActions = deviceActions;
      this.deviceStates = deviceStates;
      this.tslClients = tslClients;
      
      this.cloudDestinations = cloudDestinations;
      this.cloudKeys = cloudKeys;
      this.cloudClients = cloudClients;
      this.setupDeviceStates();
    });
    this.socket.on('listener_clients', (listenerClients: ListenerClient[]) => {
      this.listenerClients = listenerClients.map((l) => {
        l.ipAddress = l.ipAddress.replace("::ffff:", "");
        return l;
      });
    });
    this.socket.on('manage_response', (response: any) => {
      switch (response.result) {
        case 'source-added-successfully':
        case 'source-edited-successfully':
        case 'source-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('sources');
          this.socket.emit('devices');
          break;
        case 'device-added-successfully':
        case 'device-edited-successfully':
        case 'device-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('devices');
          this.socket.emit('device_sources');
          this.socket.emit('device_actions');
          this.socket.emit('device_states');
          this.socket.emit('listener_clients');
          break;
        case 'device-source-added-successfully':
        case 'device-source-edited-successfully':
          this.socket.emit('device_sources');
          this.closeModals.next();
          break;
        case 'device-source-deleted-successfully':
          this.socket.emit('device_sources');
          break;
        case 'device-action-added-successfully':
        case 'device-action-edited-successfully':
        case 'device-action-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('devices');
          this.socket.emit('device_actions');
          break;
        case 'tsl-client-added-successfully':
        case 'tsl-client-edited-successfully':
        case 'tsl-client-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('tsl_clients');
		  break;
		case 'bus-option-added-successfully':
		case 'bus-option-edited-successfully':
		case 'bus-option-deleted-successfully':
			this.closeModals.next();
			this.socket.emit('bus_options');
			break;
        case 'cloud-destination-added-successfully':
        case 'cloud-destination-edited-successfully':
        case 'cloud-destination-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('cloud_destinations');
          break;
        case 'cloud-key-added-successfully':
        case 'cloud-key-deleted-successfully':
          this.closeModals.next();
          this.socket.emit('cloud_keys');
          break;
        case 'cloud-client-removed-successfully':
          this.closeModals.next();
          this.socket.emit('cloud_clients');
          break;
        case 'error':
          alert('Unexpected Error Occurred: ' + response.error);
          break;
        default:
          alert(response.result);
          break;
      }
    });
    this.socket.on('testmode', (value: boolean) => {
      this.testModeOn = value;
    });
    this.socket.on('tslclients_1secupdate', (value: boolean) => {
      this.tslclients_1secupdate = value;
    });
    this.socket.on('PortsInUse', (ports: Port[]) => {
      this.portsInUse = ports;
    });
    this.socket.on('error_reports', (errorReports: ErrorReportsListElement[]) => {
      this.errorReports = errorReports;
    });
    this.socket.emit('get_error_reports');
    
    this.socket.emit('version');
    this.socket.emit('interfaces');
  }

  private prepareSources(sources: Source[]): Source[] {
    return sources.map((s) => {
      s.sourceTypeName = this.getSourceTypeById(s.sourceTypeId)?.label;
      return s;
    });
  }

  private getSourceTypeById(sourceTypeId: string) {
    return this.sourceTypes.find(({id}: any) => id === sourceTypeId);
  }

  public getSourceById(sourceId: string) {
    return this.sources.find(({id}) => id === sourceId);
  }

  private setupDeviceStates() {
    for (const device of this.devices) {
      this.deviceStateChanged.next({device, states: this.deviceStates.filter((s) => s.active && s.deviceId == device.id)});
    }
  }

  public joinProducers() {
    this.socket.emit('producer');
  }

  public joinAdmins() {
    this.socket.emit('settings');
  }

  public flashListener(listener: any) {
    this.socket.emit('flash', listener.id);
  }

  private getBusById(busId: string) {
    //gets the bus type (preview/program) by the bus id
    return this.busOptions.find(({id}) => id === busId);
  }

  private getBusTypeById(busId: string) {
    //gets the bus type (preview/program) by the bus id
    let bus = this.busOptions.find(({id}: {id: string}) => id === busId);
    return bus?.type;
  }

  public getErrorReportById(id: string) {
    return new Promise<ErrorReport|boolean>((resolve, reject) => {
      this.socket.emit('get_error_report', id);
      this.socket.once("error_report", (response: any) => {
        if (response !== false) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
}
