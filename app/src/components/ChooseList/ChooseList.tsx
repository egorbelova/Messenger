import { useState, useRef, useCallback } from 'react';
import { useUser } from '../../contexts/UserContext';
import Icon from '../Icon/Icon';
import ChatList from '../ChatList/ChatList';

interface ChooseListProps {
  userInfo?: {
    id: number;
    username: string;
    email: string;
  } | null;
  onLogout?: () => void;
  onRoomSelect?: (roomId: number) => void;
}

interface GroupCreationData {
  name: string;
  avatar: File | null;
}

const ChooseList: React.FC<ChooseListProps> = ({ onLogout, onRoomSelect }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'settings'>('chats');
  const [showAppearance, setShowAppearance] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupCreationStep, setGroupCreationStep] = useState(1);
  const [groupData, setGroupData] = useState<GroupCreationData>({
    name: '',
    avatar: null,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useUser();

  const roomAvatarRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  document.documentElement.style.setProperty('--rooms_display', `flex`);

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
      localStorage.removeItem('authToken');
      window.location.reload();
    }
  }, [onLogout]);

  const handleCreateGroup = useCallback(() => {
    setShowCreateGroup(true);
    setGroupCreationStep(1);
    setGroupData({ name: '', avatar: null });
  }, []);

  const handleNextGroupStep = useCallback(() => {
    if (groupData.name.trim()) {
      setGroupCreationStep(2);
    }
  }, [groupData.name]);

  const handleCancelGroup = useCallback(() => {
    setShowCreateGroup(false);
    setGroupCreationStep(1);
    setGroupData({ name: '', avatar: null });
  }, []);

  const handleGroupNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGroupData((prev) => ({ ...prev, name: e.target.value }));
    },
    []
  );

  const handleGroupAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setGroupData((prev) => ({ ...prev, avatar: e.target.files![0] }));
      }
    },
    []
  );

  const handleAppearanceShow = useCallback(() => {
    setShowAppearance(true);
  }, []);

  const handleAppearanceExit = useCallback(() => {
    setShowAppearance(false);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleTabChange = useCallback((tab: 'chats' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'chats') {
      setShowAppearance(false);
    }
  }, []);

  const handleReloadApp = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className='choose_list'>
      {/* Search Section */}
      <div className='chat-list-title'>Messages</div>
      <div className='search_div' id='search'>
        <div className='liquidGlass-effect'></div>
        <div className='liquidGlass-tint'></div>
        <div className='liquidGlass-shine'></div>
        <div className='search_field_div'>
          <div className='search_icon_div'>
            <Icon name='search-icon' className='search_icon' />
          </div>
          <div className='search_field_input'>
            <input
              aria-label='Search'
              className='search_field'
              name='term'
              placeholder=' '
              value={searchTerm}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <span className='search_field_placeholder'>Search</span>
          </div>
        </div>
        <div className='search_cross_div' onClick={handleSearchClear}>
          <svg className='search_cross'>
            <use href='#cross-icon'></use>
          </svg>
        </div>
      </div>

      <div className='left-menu'>
        <div className='shadow-header'></div>

        {/* Settings Menu */}
        {!showAppearance && (
          <div className='settings_menu'>
            <div id='user_avatar_settings_menu'>
              <div className='user_avatar_settings_menu_background'></div>
              <div id='user_avatar_settings_menu_image'></div>
              <div id='username_settings_menu'></div>
            </div>
            <div className='settings_menu_options'>
              <div className='system_settings'>
                <div
                  id='create_new_group'
                  className='settings_menu_div'
                  onClick={handleCreateGroup}
                >
                  <div className='settings_menu_div_padding'>
                    <span>New Group</span>
                    <svg className='arrow-right'>
                      <use href='#arrow'></use>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='system_settings'>
                <div
                  id='settings'
                  className='settings_menu_div'
                  onClick={handleAppearanceShow}
                >
                  <div className='settings_menu_div_padding'>
                    <span>Appearance</span>
                    <svg className='arrow-right'>
                      <use href='#arrow'></use>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='system_settings'>
                <div
                  id='logout'
                  className='settings_menu_div logout-btn'
                  onClick={handleLogout}
                >
                  <div className='settings_menu_div_padding'>
                    <span id='logout-span'>Logout</span>
                    <svg className='arrow-right'>
                      <use href='#arrow'></use>
                    </svg>
                  </div>
                </div>
                <div
                  className='reloadLocationButton settings_menu_div'
                  onClick={handleReloadApp}
                >
                  <div className='settings_menu_div_padding'>
                    <span>Reload App</span>
                    <svg className='arrow-right'>
                      <use href='#arrow'></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ChatList />

        {/* Appearance Settings */}
        {showAppearance && (
          <div className='settings'>
            <div className='appearance-header'>
              <svg
                className='arrow-left'
                id='appearance_exit'
                onClick={handleAppearanceExit}
              >
                <use href='#arrow'></use>
              </svg>
            </div>
            <div className='appearance_options'>
              <div className='appearance_option'>
                <div id='chat_background_color'>Background Color</div>
                <div id='color_chat_change_div'>
                  <input
                    type='color'
                    id='color_chat_change'
                    name='color_chat_change'
                  />
                </div>
              </div>
              <div className='appearance_option'>
                <div id='shadow_degree'>Background Shadow Degree</div>
                <div>
                  <input
                    id='shadow_degree_chat'
                    type='range'
                    min='0'
                    max='360'
                    step='1'
                    value='0'
                  />
                </div>
              </div>
              <div className='appearance_option'>
                <div id='reduce_animations'>
                  Reduce Animations
                  <div className='switch_div'>
                    <label className='switch' htmlFor='reduce_animations_check'>
                      <input type='checkbox' id='reduce_animations_check' />
                      <span className='slider round'></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hidden sections from original */}
              <div
                id='avatar_profile_set'
                style={{ display: 'none !important' }}
              >
                <input
                  type='file'
                  id='input_user_avatar'
                  accept='image/png, image/gif, image/jpeg'
                />
                <div id='avatar_profile_set_save'>Save</div>
              </div>
              <div className='appearance_option' style={{ display: 'none' }}>
                <div id='dark_mode'>
                  Dark Theme
                  <div className='switch_div'>
                    <label className='switch' htmlFor='dark_mode_check'>
                      <input type='checkbox' id='dark_mode_check' />
                      <span className='slider round'></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Tabs */}
      <div className='left-menu-footer-padding'>
        <fieldset className='left-menu-footer'>
          <div className='tab-indicator'></div>
          <div
            className={`left-menu-footer-chats ${
              activeTab === 'chats' ? 'active' : ''
            }`}
            onClick={() => handleTabChange('chats')}
            data-tab='chats'
          >
            <svg className='chats_icon'>
              <use href='#chats-icon'></use>
            </svg>
          </div>
          <div
            className={`left-menu-footer-settings ${
              activeTab === 'settings' ? 'active' : ''
            }`}
            onClick={() => handleTabChange('settings')}
            data-tab='settings'
          >
            <div className='dropbtn'></div>
          </div>
        </fieldset>
      </div>

      {/* Group Creation Modal */}
      {showCreateGroup && (
        <div id='create_new_group_room'>
          <div
            className={`creation_group_first_page ${
              groupCreationStep === 1 ? 'active' : ''
            }`}
          >
            <div id='creation_group_GIVE_A_NAME'>
              <div id='creation_group_NEXT_CANCEL_div_GROUPNAME'>
                <div id='creation_group_NEXT_CANCEL_div'>
                  <div
                    id='creation_group_CANCEL_GROUPNAME'
                    onClick={handleCancelGroup}
                  >
                    Cancel
                  </div>
                  <div
                    id='creation_group_NEXT_GROUPNAME'
                    onClick={handleNextGroupStep}
                  >
                    Next
                  </div>
                </div>
              </div>
              <input
                placeholder='Group Name'
                id='creation_group_GIVE_A_NAME_input'
                value={groupData.name}
                onChange={handleGroupNameChange}
              />
            </div>
            <div id='creation_group_AVATAR'>
              <input
                type='file'
                id='input_room_avatar'
                accept='image/png, image/gif, image/jpeg'
                onChange={handleGroupAvatarChange}
                ref={roomAvatarRef}
              />
              <label htmlFor='input_room_avatar'>Group Photo</label>
            </div>
          </div>

          <div
            className={`creation_group_second_page ${
              groupCreationStep === 2 ? 'active' : ''
            }`}
          >
            <div id='creation_group_CREATE_CANCEL_div'>
              <div id='creation_group_CANCEL' onClick={handleCancelGroup}>
                Cancel
              </div>
              <div id='creation_group_CREATE'>Create</div>
            </div>
            <div className='all_my_contacts'></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseList;
