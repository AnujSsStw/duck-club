"use client";
import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Upload } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";

const HuntEntryForm = () => {
  const [formData, setFormData] = useState({
    locationId: '',
    date: '',
    timeSlot: '',
    blindSessions: []
  });

  // Mock data - replace with real data from your backend
  const locations = [
    { id: '1', name: 'Duck Creek' },
    { id: '2', name: 'Swan Lake' }
  ];

  const blinds = [
    { id: '1', name: '1A' },
    { id: '2', name: 'Pit' },
    { id: '3', name: 'Double' }
  ];

  const hunters = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ];

  const species = [
    { id: '1', name: 'Mallard' },
    { id: '2', name: 'Teal' }
  ];

  const addBlindSession = () => {
    setFormData(prev => ({
      ...prev,
      blindSessions: [
        ...prev.blindSessions,
        {
          id: Date.now(),
          blindId: '',
          huntersPresent: [],
          harvests: [],
          notes: '',
          pictures: []
        }
      ]
    }));
  };

  const removeBlindSession = (sessionId) => {
    setFormData(prev => ({
      ...prev,
      blindSessions: prev.blindSessions.filter(session => session.id !== sessionId)
    }));
  };

  const updateBlindSession = (sessionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      blindSessions: prev.blindSessions.map(session =>
        session.id === sessionId ? { ...session, [field]: value } : session
      )
    }));
  };

  const addHarvest = (sessionId) => {
    setFormData(prev => ({
      ...prev,
      blindSessions: prev.blindSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              harvests: [
                ...session.harvests,
                { id: Date.now(), speciesId: '', quantity: 0 }
              ]
            }
          : session
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Add your submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Main hunt details */}
      <Card>
        <CardHeader>
          <CardTitle>Hunt Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select
              value={formData.locationId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full pl-10 py-2 border rounded-md bg-black"
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Slot</label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blind Sessions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Blind Sessions</h2>
          <button
            type="button"
            onClick={addBlindSession}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Blind
          </button>
        </div>

        {formData.blindSessions.map(session => (
          <Card key={session.id} className="relative">
            <button
              type="button"
              onClick={() => removeBlindSession(session.id)}
              className="absolute right-4 top-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            <CardHeader>
              <CardTitle>Blind Details</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Blind Selection */}
              <Select
                value={session.blindId}
                onValueChange={(value) => updateBlindSession(session.id, 'blindId', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select blind" />
                </SelectTrigger>
                <SelectContent>
                  {blinds.map(blind => (
                    <SelectItem key={blind.id} value={blind.id}>
                      {blind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Hunters Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hunters</label>
                <Select
                  value={session.huntersPresent}
                  onValueChange={(value) => updateBlindSession(session.id, 'huntersPresent', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select hunters" />
                  </SelectTrigger>
                  <SelectContent>
                    {hunters.map(hunter => (
                      <SelectItem key={hunter.id} value={hunter.id}>
                        {hunter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Harvests */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Harvests</label>
                  <button
                    type="button"
                    onClick={() => addHarvest(session.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Species
                  </button>
                </div>
                {session.harvests.map((harvest, index) => (
                  <div key={harvest.id} className="flex gap-2">
                    <Select
                      value={harvest.speciesId}
                      onValueChange={(value) => {
                        const newHarvests = [...session.harvests];
                        newHarvests[index].speciesId = value;
                        updateBlindSession(session.id, 'harvests', newHarvests);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        {species.map(species => (
                          <SelectItem key={species.id} value={species.id}>
                            {species.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="number"
                      min="0"
                      value={harvest.quantity}
                      onChange={(e) => {
                        const newHarvests = [...session.harvests];
                        newHarvests[index].quantity = parseInt(e.target.value);
                        updateBlindSession(session.id, 'harvests', newHarvests);
                      }}
                      className="w-24 px-3 py-2 border rounded-md"
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={session.notes}
                  onChange={(e) => updateBlindSession(session.id, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-black"
                  rows={3}
                />
              </div>

              {/* Picture Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pictures</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Pictures
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Hunt
        </button>
      </div>
    </form>
  );
};

export default HuntEntryForm;