'use client';

import { useState, useEffect, use } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Rules from './components/Rules';
import Connections from './components/Connections';
import OutputLogs from './components/OutputLogs';
import TabPanel from './components/TabPanel';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useStreams } from '@/hooks/streams';
import { v4 } from "uuid";

export default function Home() {

  const [outputData, setOutputData] = useState<Record<string, any>>({});
  const [renderOutputData, setRenderOutputData] = useState<Record<string, any>>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [streamIds, setStreamIds] = useState<Array<string>>([]);
  const [startStreamSelected, setStartStreamSelected] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const { refetchStreams } = useStreams();

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:3001');

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const { streamId, data } = message;

          setStreamIds(prevStreamIds => {
            if (!prevStreamIds.includes(streamId)) {
              const newStreamIds = [
                ...prevStreamIds,
                streamId
               ] as Array<string>;
               refetchStreams();
              return newStreamIds;
            } else {
              return prevStreamIds;
            }
          })

          setOutputData(prevData => {
            const newData = {
              ...prevData,
              [streamId]: [
                data,
                ...(prevData[streamId] || []),
              ],
            } as Record<string, any>;
            delete newData["undefined"];
            return newData;
          });
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setReconnectAttempt((prev) => prev + 1);
        setTimeout(connectWebSocket, Math.min(5000 * reconnectAttempt, 30000));
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [reconnectAttempt]);

  useEffect(() => {
    setRenderOutputData(outputData);
  }, [outputData]);

  const startStream = (streamId: string) => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'startStream', streamId }));
    }
  };

  const stopStream = (streamId: string) => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'stopStream', streamId }));
    }
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

useEffect(() => {
  if (startStreamSelected) {
    const streamId = v4();
    startStream(streamId);
    setStartStreamSelected(false);
    handleCloseModal();
  }
  }, [startStreamSelected])

  return (
      <main className="bg-zinc-950 text-white">
      <div className="container mx-auto pt-10 min-h-screen">
        <div className="flex flex-col gap-2">
          <div className="py-3 text-3xl">
            Stream Dashboard
          </div>
          {<p className="text-md">Manage streaming rules and connections.</p>}
          <Divider flexItem />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Filtered Stream" />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Stack direction="row" spacing={4}>
              <Rules />
              <Connections type="FILTERED_STREAM" startStream={handleOpenModal} stopStream={stopStream}/>
              <OutputLogs data={renderOutputData}/>
            </Stack>
          </TabPanel>
        </div>

        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              New connection
            </Typography>
            <Typography id="modal-modal-description" sx={{ my: 2 }}>
              Are you sure you want to start a streaming connection?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button className="text-white bg-zinc-600 hover:text-black hover:bg-white w-full" size="medium" variant="contained" onClick={() => setStartStreamSelected(true)}>Confirm</Button>
              <Button className="text-white bg-zinc-800 hover:text-black hover:bg-white w-full" size="medium" variant="contained" onClick={handleCloseModal}>Cancel</Button>
            </Stack>
            
          </Box>
        </Modal>
      </div>
    </main>
  );
}